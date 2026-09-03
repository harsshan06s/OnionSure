from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
from pathlib import Path
from datetime import datetime, timezone
from typing import Any
import hashlib, io, json, os, uuid
from .ai.providers import DemoAIProvider, ProductionAIProvider
from .grading.engine import grade_onions
from .reports.pdf import build_report

app=FastAPI(title='OnionSure API',version='1.0.0')
app.add_middleware(CORSMiddleware,allow_origins=['*'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
DATA=Path(os.getenv('DATA_DIR','./data')); DATA.mkdir(exist_ok=True)
provider=ProductionAIProvider() if os.getenv('ONIONSURE_MODEL_PATH') else DemoAIProvider()

class Onion(BaseModel):
    id:int; diameterMm:float; condition:str; confidence:float; decision:str; reason:str
class InspectionPayload(BaseModel):
    id:str; batchId:str; centre:str; createdAt:str; gradeA:float; urs:float; reject:float; manual:float; status:str; onions:list[Onion]

@app.get('/health')
def health(): return {'status':'ok','service':'onionsure-api','ai_provider':provider.name}

@app.post('/api/ai/calibrate')
async def calibrate(image: UploadFile=File(...)):
    data=await image.read()
    if not data: raise HTTPException(400,'Empty image')
    return {'calibrated':False,'mode':'demo','message':'No valid ArUco marker detected; use demo calibration for estimated measurements.'}

@app.post('/api/ai/analyze')
async def analyze(image: UploadFile|None=File(None), batch_id:str=Form('')):
    if image:
        data=await image.read()
        if len(data)>12*1024*1024: raise HTTPException(413,'Image is too large')
        if not data: raise HTTPException(400,'Invalid image')
        try:
            from PIL import Image
            Image.open(io.BytesIO(data)).verify()
        except Exception as e: raise HTTPException(400,'Please upload a valid image') from e
    result=provider.analyze(data if image else b'')
    graded=grade_onions(result['onions'], {'version':'2026.1','gradeA':{'minDiameterMm':45,'maxDiameterMm':65,'allowSprouting':False,'allowMajorDamage':False,'allowRot':False},'manualReviewThreshold':90})
    onions=graded['onions']; counts=graded['summary']
    inspection_id='ON-'+datetime.now(timezone.utc).strftime('%Y')+'-'+str(uuid.uuid4())[:6].upper()
    return {'inspection_id':inspection_id,'batch_id':batch_id,'ai_provider':provider.name,'onions':onions,'summary':counts,'disclaimer':'Demo results are illustrative and are not scientifically validated.'}

@app.post('/api/reports/generate')
def generate_report(payload:InspectionPayload):
    report_data=payload.model_dump(); canonical=json.dumps(report_data,sort_keys=True,separators=(',',':')).encode(); h=hashlib.sha256(canonical).hexdigest(); (DATA/f'{payload.id}.json').write_text(json.dumps({'payload':report_data,'reportHash':h},sort_keys=True)); pdf=build_report(report_data,h)
    return StreamingResponse(io.BytesIO(pdf),media_type='application/pdf',headers={'Content-Disposition':f'attachment; filename={payload.id}.pdf','X-Report-Hash':h})

@app.get('/api/verify/{verification_id}')
def verify(verification_id:str):
    p=DATA/f'{verification_id}.json'
    if not p.exists(): return JSONResponse({'verificationId':verification_id,'status':'NOT_FOUND'},status_code=404)
    obj=json.loads(p.read_text()); current=hashlib.sha256(json.dumps(obj['payload'],sort_keys=True,separators=(',',':')).encode()).hexdigest(); ok=current==obj['reportHash']
    return {'verificationId':verification_id,'status':'VERIFIED' if ok else 'INVALID / MODIFIED REPORT','reportHash':obj['reportHash']}

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm
import io, qrcode

def build_report(d,h):
    buf=io.BytesIO(); doc=SimpleDocTemplate(buf,pagesize=A4,rightMargin=16*mm,leftMargin=16*mm,topMargin=15*mm,bottomMargin=15*mm); s=getSampleStyleSheet(); title=ParagraphStyle('TitleX',parent=s['Title'],fontSize=22,textColor=colors.HexColor('#163a24'),alignment=TA_CENTER); story=[Paragraph('OnionSure',title),Paragraph('AI-Powered Quality. Transparent Procurement.',s['Normal']),Spacer(1,8)]
    story += [Paragraph('DIGITAL QUALITY REPORT',s['Heading2']),Table([['Inspection ID',d['id']],['Batch ID',d['batchId']],['Procurement Centre',d['centre']],['Created',d['createdAt']],['Status',d['status']]],colWidths=[45*mm,125*mm],style=TableStyle([('GRID',(0,0),(-1,-1),.3,colors.lightgrey),('FONTNAME',(0,0),(0,-1),'Helvetica-Bold'),('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(0,-1),colors.HexColor('#edf3ed'))]))]
    story += [Spacer(1,8),Table([['Grade A',f"{d['gradeA']}%"],['URS',f"{d['urs']}%"],['Reject',f"{d['reject']}%"],['Manual Review',f"{d['manual']}%"]],colWidths=[70*mm,55*mm],style=TableStyle([('GRID',(0,0),(-1,-1),.3,colors.lightgrey),('FONTNAME',(0,0),(0,-1),'Helvetica-Bold')]))]
    counts={};
    for o in d['onions']: counts[o['condition']]=counts.get(o['condition'],0)+1
    story += [Spacer(1,8),Paragraph('Defect distribution',s['Heading3']),Table([[k,str(v)] for k,v in counts.items()] or [['None','0']],style=TableStyle([('GRID',(0,0),(-1,-1),.3,colors.lightgrey)])),Spacer(1,8),Paragraph('Audit metadata',s['Heading3']),Paragraph('Grading rule version: 2026.1',s['Normal']),Paragraph('AI model: DEMO AI MODEL',s['Normal']),Paragraph('Report SHA-256: '+h,s['Normal']),Spacer(1,6),Paragraph('Scientific limitation: ordinary RGB images can identify externally visible defects, but internal defects without visible indication cannot be reliably detected using RGB computer vision alone. Suspected cases should be manually inspected.',s['Normal']),Spacer(1,10)]
    qr=qrcode.make('verify/'+d['id']); qbuf=io.BytesIO(); qr.save(qbuf,format='PNG'); qbuf.seek(0); story += [Image(qbuf,width=28*mm,height=28*mm),Paragraph('Scan to verify report integrity in the OnionSure verification portal.',s['Normal']),Spacer(1,10),Paragraph('DEMO REPORT — not government certification and not a claim of validated agricultural accuracy.',s['Italic'])]
    doc.build(story); return buf.getvalue()

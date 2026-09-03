from app.grading.engine import grade_onions
R={'version':'2026.1','gradeA':{'minDiameterMm':45,'maxDiameterMm':65,'allowSprouting':False,'allowMajorDamage':False,'allowRot':False},'manualReviewThreshold':90}
def test_healthy_grade_a(): assert grade_onions([{'id':1,'diameterMm':52,'condition':'healthy','confidence':97}],R)['onions'][0]['decision']=='GRADE A'
def test_undersized_urs(): assert grade_onions([{'id':1,'diameterMm':40,'condition':'healthy','confidence':97}],R)['onions'][0]['decision']=='URS'
def test_rot_reject(): assert grade_onions([{'id':1,'diameterMm':52,'condition':'rotten','confidence':97}],R)['onions'][0]['decision']=='REJECT'
def test_low_confidence_review(): assert grade_onions([{'id':1,'diameterMm':52,'condition':'healthy','confidence':70}],R)['onions'][0]['decision']=='MANUAL REVIEW'

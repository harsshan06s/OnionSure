def grade_one(o,rules):
    c=o['condition']; d=o['diameterMm']; conf=o['confidence']; threshold=rules.get('manualReviewThreshold',90)
    if conf < threshold: return {**o,'decision':'MANUAL REVIEW','reason':f'AI confidence below configured threshold ({threshold}%).'}
    if c=='rotten': return {**o,'decision':'REJECT','reason':'Rot detected; reject rule is configured for this grading profile.'}
    if c in ('sprouted','damaged'): return {**o,'decision':'URS','reason':f'{c.title()} detected and Grade A allowance is disabled.'}
    if d < rules['gradeA']['minDiameterMm']: return {**o,'decision':'URS','reason':'Diameter below configured Grade A minimum.'}
    if d > rules['gradeA']['maxDiameterMm']: return {**o,'decision':'URS','reason':'Diameter above configured Grade A maximum.'}
    return {**o,'decision':'GRADE A','reason':'Meets configured Grade A rules.'}
def grade_onions(onions,rules):
    out=[grade_one(o,rules) for o in onions]; n=len(out) or 1
    counts={k:sum(1 for x in out if x['decision']==k) for k in ['GRADE A','URS','REJECT','MANUAL REVIEW']}
    return {'onions':out,'summary':{'total_onions':len(out),'grade_a_percentage':round(counts['GRADE A']/n*100,1),'urs_percentage':round(counts['URS']/n*100,1),'reject_percentage':round(counts['REJECT']/n*100,1),'manual_review_percentage':round(counts['MANUAL REVIEW']/n*100,1),'counts':counts}}

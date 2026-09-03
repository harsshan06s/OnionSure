# OnionSure AI documentation

## Classes

Recommended visual classes: `onion`, `damaged`, `rotten`, `sprouted`. Size is measured from calibrated physical geometry rather than inferred only from a classifier.

## Dataset workflow

1. Collect representative RGB images under varied lighting, camera distances, backgrounds and onion varieties.
2. De-identify and version the dataset.
3. Annotate individual onion instances with segmentation masks and defect labels.
4. Split by physical batch/source to reduce leakage: train/validation/test.
5. Augment with realistic scale, illumination, rotation and blur changes.
6. Train an Ultralytics YOLO segmentation detector and a defect classifier where useful.
7. Evaluate per-class precision, recall, mAP/IoU and calibration/reliability on a held-out test set.
8. Export to ONNX when the deployment target benefits from it.
9. Version weights, preprocessing and label map together.
10. Validate in field conditions before operational use.

## Limitations

RGB vision only observes external appearance. Internal rot or defects without external indication require manual or another sensing modality. Never claim 100% accuracy or government certification without an appropriate validation and approval process.

## Model location

Put validated `.pt` or ONNX weights in `ai/models/`. Configure `ONIONSURE_MODEL_PATH` on the backend. The production adapter must be connected to the `AIModelProvider` interface before enabling it.

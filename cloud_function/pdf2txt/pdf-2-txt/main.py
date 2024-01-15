import functions_framework
from google.cloud import vision
@functions_framework.http
def pdf2txt(request):
    # Check if the post request has the file part
    if 'file' not in request.files:
        return 'No file part in the request'

    file = request.files['file']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return 'No selected file'
    client = vision.ImageAnnotatorClient()
    if file:
        # Process the file here
        file_content = file.read()
        vision_image = vision.Image(content=file_content)
        response = client.document_text_detection(image=vision_image)
        texts = response.text_annotations
        print('Texts:')
        for text in texts:
            print('\n"{}"'.format(text.description))
            vertices = (['({},{})'.format(vertex.x, vertex.y)
                        for vertex in text.bounding_poly.vertices])
            print('bounds: {}'.format(','.join(vertices)))

        return 'File and JSON data received'
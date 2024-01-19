import functions_framework
from pypdf import PdfReader
@functions_framework.http
def pdf2txt(request):
    '''
    this function is to extract text from pdf file,
    first get pdf from request,
    then save pdf to google cloud storage,
    then read pdf from google cloud storage, 
    then extract text from pdf file, 
    finally return the extracted text.
    '''
    # 1. get pdf from request
    resume_pdf = request.files['resume']
    # 2. save pdf to google cloud storage
    resume_pdf.save('/tmp/resume.pdf')
    # 3. read pdf from google cloud storage
    resume_pdf = PdfReader('/tmp/resume.pdf')
    # 4. extract text from pdf file
    resume_txt = ''
    for page in resume_pdf.pages:
        resume_txt += page.extract_text()
    resume_txt = resume_txt.replace('\n', ' ')
    # 5. return the extracted text in json format
    return {'resume_txt': resume_txt}
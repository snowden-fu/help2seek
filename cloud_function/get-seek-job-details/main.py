import functions_framework

@functions_framework.http
def get_seek_job_details(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
    """
    # request should contain be `{ "job_url": "<url_string>" }`
    request_json = request.get_json(silent=True)
    if request_json and 'job_url' in request_json:
        job_url = request_json['job_url']
        # call fetch_seek_job_details function
        job_details = fetch_seek_job_details(job_url)
        # return job_details in json format
        return job_details

def fetch_seek_job_details(url:str)->dict:
  # crawl data from seek, return title, description and company name of a job
  import requests
  from bs4 import BeautifulSoup
  response = requests.get(url)
  if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    job_title =soup.find('h1').get_text()
    job_desc = soup.find('section').get_text()
    all_spans_list = soup.find_all('span', class_=["_1wkzzau0", "a1msqi4y", "a1msqir"])
    job_location = [s.get_text() for s in all_spans_list if is_job_location(s.get_text())][0]
    job_details = {"job_title": job_title, "job_location": job_location, "job_desc": job_desc}
    return job_details

import re
def is_job_location(string):
    # List of Australian states and territories
    australian_states = [
        "New South Wales", "NSW", "Queensland", "QLD",
        "South Australia", "SA", "Tasmania", "TAS",
        "Victoria", "VIC", "Western Australia", "WA",
        "Australian Capital Territory", "ACT", "Northern Territory", "NT"
    ]


    # Create a regular expression pattern to match any of the state names
    # The pattern uses re.IGNORECASE to make the search case-insensitive
    pattern = r'\b(?:' + '|'.join(re.escape(state) for state in australian_states) + r')\b'
    regex = re.compile(pattern, re.IGNORECASE)

    # Search for any of the state names in the string
    return regex.search(string) is not None
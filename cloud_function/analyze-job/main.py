import functions_framework
from google.cloud import secretmanager
import openai
import os
@functions_framework.http
def analyze_job(request):
    # 1. get openai key from secret manager
    secret_name = os.getenv("SECRET_NAME")
    project_id = os.getenv("PROJECT_ID")
    get_secret_response = get_secret(project_id, secret_name)
    openai_key = get_secret_response
    request_data = request.get_json()
    job_desc = request_data['job_desc']
    resume_text = request_data['resume_text']
    # get job description from request
    # job_post_text = request.args.get('job_desc')
    # get resume from request
    # resume_text = request.args.get('resume')
    # call openai api
    client = openai.Client(openai_key)
    response = client.chat.completions.create(
  model="gpt-3.5-turbo-1106",
  response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": """You are a helpful assistant, assessing how much does the resume match the job post in percent,
    and giving skill tags list, including matched skill and missed skill, as well as visa required,the result should in given template of JSON."""},
    {"role": "assistant", "content": "give template of JSON"},
    {"role": "user", "content": f'''this is the template of JSON,
    template:
    """
    {{
  "matched_skills": [
    "<skill A>",
    "<skill B>",
    "<skill C>"
  ],
  "missed_skills": [
    "<skill D>",
    "<skill E>",
    "<skill F>"
  ],
  "match_percent": <number>,
  "visa_required": {{
    "PR": <Bool type>,
    "citizen": <Bool type>
  }}
}}
    """

    '''},
    {"role": "assistant", "content": "give resume and job post for assessing"},
    {"role": "user", "content": f'''this is the resume,
    resume:
    """
    {resume_text}
    """,
    and this is the job post
    """
    {job_desc}
    """
    '''
    }
  ]
)
    return response


def get_secret(project_id: str, secret_id: str) -> secretmanager.GetSecretRequest:
    """
    Get information about the given secret. This only returns metadata about
    the secret container, not any secret material.
    """

    # Import the Secret Manager client library.
    from google.cloud import secretmanager

    # Create the Secret Manager client.
    client = secretmanager.SecretManagerServiceClient()

    # Build the resource name of the secret.
    name = client.secret_path(project_id, secret_id)

    # Get the secret.
    response = client.get_secret(request={"name": name})

    # Get the replication policy.
    if "automatic" in response.replication:
        replication = "AUTOMATIC"
    elif "user_managed" in response.replication:
        replication = "MANAGED"
    else:
        raise Exception(f"Unknown replication {response.replication}")

    # return data about the secret.
    return replication

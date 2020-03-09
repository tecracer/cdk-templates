import json
import os

from datetime import datetime

import jwt
import pytz

from flask import Flask, request, render_template, make_response, redirect

app = Flask(__name__)

JWT_HEADER_NAME = "x-amzn-oidc-data"

@app.route('/')
def home():

    jwt_header = request.headers.get(JWT_HEADER_NAME)

    if jwt_header is None:
        jwt_header = "eyJ0eXAiOiJKV1QiLCJraWQiOiI2OWVmNGNhZS0wYWJmLTRjNTItYWIyNS03NGI2NDA3MGJlMGUiLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb20vZXUtY2VudHJhbC0xXzFLaWxSckN0ViIsImNsaWVudCI6InIzdmwxcXE5ZHFuNXJqYTNjdTBvZTZzZ2UiLCJzaWduZXIiOiJhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOmV1LWNlbnRyYWwtMTo2ODk2ODAwODQwMzU6bG9hZGJhbGFuY2VyL2FwcC9jb2duaS1GYXJnYS0xMkZMQUEwVkRHQ1dXLzgzZDQxNTBkNmFmM2RiOTYiLCJleHAiOjE1ODM1ODY3ODB9.eyJzdWIiOiIzZjFmODc4My04ZTI3LTQ3M2QtODUyZS05MGM5NGM0ZjI3MGIiLCJ1c2VybmFtZSI6Im1ib3JnbWVpZXJAdGVjcmFjZXIuZGUiLCJleHAiOjE1ODM1ODY3ODAsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb20vZXUtY2VudHJhbC0xXzFLaWxSckN0ViJ9.nXCE9-LtOfxeRGYia4THH8U4xhKv15Sr3H-lzCLAnJ9p8kJ3kkZie6gfd-Yen3SzonB45Ycu0uSrS5X7JUyo2A"

    #TODO: In production you WANT to verify the signature!
    jwt_decoded = jwt.decode(jwt_header, verify=False)

    variables = {
        "username": jwt_decoded["username"],
        "valid_until_utc": datetime.fromtimestamp(jwt_decoded["exp"],tz=pytz.UTC).isoformat(),
        "jwt_decoded": json.dumps(jwt_decoded, indent=4),
    }

    return render_template("index.html", **variables)

@app.route('/logout')
def logout():
    
    # Looks a little weird, but this is the only way to get an HTTPS redirect
    response = make_response(redirect(os.environ.get("LOGOUT_URL", f"https://{request.host}/")))

    # Invalidate the session cookie
    response.set_cookie("AWSELBAuthSessionCookie-0", "empty", max_age=-3600)


    return response

if __name__ == '__main__':

    app.run(debug=True, host='0.0.0.0', port=os.environ.get("PORT", 8080))
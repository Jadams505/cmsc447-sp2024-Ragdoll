import requests


def uritest():
    requests.post("http://127.0.0.1:8000/update/uri").json()


if __name__ == '__main__':
    print(uritest())
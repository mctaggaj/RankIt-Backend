from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

#engine = create_engine('mysql+pymysql://blbadmin:Chickenpotpie1@beerleagueblog.ca/blb')
#Base = declarative_base()
#Base.metadata.reflect(engine)

app = Flask(__name__)

@app.route('/')
def index():
    return "Yo, this is the root URI, it doesn't do anything other than show you this message!"

@app.route('/users')
def cook_rating():
    return "Hey look, this is a GET request for users."

if __name__ == '__main__':
    app.run(debug=True)

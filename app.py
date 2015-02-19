from flask import Flask, jsonify, request
import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

#engine = create_engine('mysql+pymysql://blbadmin:Chickenpotpie1@beerleagueblog.ca/blb')
#Base = declarative_base()
#Base.metadata.reflect(engine)

comps = [{
  "competitionId": 0,
  "name": "Mario Cup",
  "subject": "Mario Cart",
  "description": "May the best nerd win",
  "location": "Jason's House",
  "public": True,
  "results": [],
  "state": "In Progress",
  "participants": [
    {
      "userId": 0,
      "competitionId": 0,
      "compRoleId": 0,
      "rank": 1,
      "permissions": {
        "permId": 0,
        "admin": False,
        "judge": False,
        "competitor": True
      }
    },
    {
      "userId": 1,
      "competitionId": 0,
      "compRoleId": 1,
      "rank": 2,
      "permissions": {
        "admin": False,
        "judge": False,
        "competitor": True
      }
    },
    {
      "userId": 2,
      "competitionId": 0,
      "compRoleId": 2,
      "rank": 3,
      "permissions": {
        "admin": False,
        "judge": False,
        "competitor": True
      }
    },
    {
      "userId": 3,
      "competitionId": 0,
      "compRoleId": 3,
      "rank": 4,
      "permissions": {
        "admin": True,
        "judge": True,
        "competitor": True
      }
    }
  ],
  "streamURL": "",
  "stages": [
    {
      "stageId": 0,
      "competitionId": 0,
      "name": "Semi Finals",
      "description": "Elimination Round",
      "nextStage": 1,
      "location": "Mario Circut",
      "state": "Completed",
      "seed": [
        1,
        2,
        3,
        4
      ],
      "participants": [
        {
          "userId": 0,
          "stageId": 0,
          "stageRoleId": 0,
          "rank": 1,
          "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
          }
        },
        {
          "userId": 1,
          "stageId": 0,
          "stageRoleId": 1,
          "rank": 2,
          "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
          }
        },
        {
          "userId": 2,
          "stageId": 0,
          "stageRoleId": 2,
          "rank": 3,
          "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
          }
        },
        {
          "userId": 3,
          "stageId": 0,
          "stageRoleId": 3,
          "rank": 4,
          "permissions": {
            "admin": True,
            "judge": True,
            "competitor": True
          }
        }
      ],
      "results": [
        0,
        2,
        1,
        3
      ],
      "event": [
        {
          "eventId": 0,
          "name": "Race 1",
          "location": "Mario Circut",
          "stageId": 0,
          "state": "Completed",
          "results": [
            "user1",
            "user4"
          ],
          "seed": [
            1,
            4
          ],
          "participants": [
            {
              "userId": 0,
              "eventId": 0,
              "eventRoleId": 0,
              "rank": 1,
              "permissions": {
                "admin": False,
                "judge": False,
                "competitor": True
              }
            },
            {
              "userId": 3,
              "eventId": 0,
              "eventRoleId": 1,
              "rank": 4,
              "permissions": {
                "admin": True,
                "judge": True,
                "competitor": True
              }
            }
          ]
        },
        {
          "eventId": 1,
          "name": "Race 1",
          "location": "Mario Circut",
          "stageId": 0,
          "state": "Completed",
          "results": [ 
            2,
            1
          ],
          "seed": [
            2,
            3
          ],
          "participants": [
            {
              "userId": 1,
              "eventId": 1,
              "eventRoleId": 2,
              "rank": 2,
              "permissions": {
                "admin": False,
                "judge": False,
                "competitor": True
              }
            },
            {
              "userId": 2,
              "eventId": 1,
              "eventRoleId": 3,
              "rank": 3,
              "permissions": {
                "admin": False,
                "judge": False,
                "competitor": True
              }
            },
            {
              "userId": 3,
              "eventId": 1,
              "eventRoleId": 4,
              "rank": -1,
              "permissions": {
                "admin": True,
                "judge": True,
                "competitor": False
              }
            }
          ]
        }
      ]
    },
    {
      "stageId": 1,
      "competitionId": 0,
      "name": "Finals",
      "description": "Winner takes the cup",
      "previousStage": 0,
      "location": "Mario Circut",
      "state": "In Progress",
      "seed": [
        1,
        2
      ],
      "participants": [
        {
          "userId": 0,
          "stageId": 1,
          "stageRoleId": 4,
          "rank": 1,
          "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
          }
        },
        {
          "userId": 2,
          "stageId": 1,
          "stageRoleId": 5,
          "rank": 2,
          "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
          }
        },
        {
          "userId": 3,
          "stageId": 1,
          "stageRoleId": 6,
          "rank": -1,
          "permissions": {
            "admin": True,
            "judge": True,
            "competitor": False
          }
        }
      ],
      "results": [],
      "event": [
        {
          "eventId": 2,
          "name": "Fianl Race",
          "location": "Mario Circut",
          "stageId": 1,
          "state": "In Progress",
          "seed": [
            1,
            4
          ],
          "participants": [
            {
              "userId": 0,
              "eventId": 2,
              "eventRoleId": 5,
              "rank": 1,
              "permissions": {
                "admin": False,
                "judge": False,
                "competitor": True
              }
            },
            {
              "userId": 2,
              "eventId": 2,
              "eventRoleId": 6,
              "rank": 2,
              "permissions": {
                "admin": False,
                "judge": False,
                "competitor": True
              }
            },
            {
              "userId": 3,
              "eventId": 1,
              "eventRoleId": 6,
              "rank": -1,
              "permissions": {
                "admin": True,
                "judge": True,
                "competitor": False
              }
            }
          ]
        }
      ]
    }
  ]
}]

users = {'users': [
        {"userName" : "mctaggaj@mail.uoguelph.ca",
         "userId" : 1,
         "password" : "smellslikesoup"
        },
        {"userName" : "test@test.ca",
         "userId" : 2,
         "password" : "abc123"
        }
        ]}

app = Flask(__name__, static_url_path="", static_folder="package")

def generateToken():
    return uuid.uuid4().hex


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/competitions/<competition_id>', methods=['GET', 'PUT'])
def competition(competition_id):
    if request.method == 'PUT':
        return "Not yet implemented"
    elif request.method == 'GET':
        for competition in comps:
            if competition['competitionId'] == int(competition_id):
                return jsonify({'competition': competition, 'status': 'OK'})
        return jsonify({'status': 'NoCompetition', 'msg': 'Competition ID was not found.'}), 404

@app.route('/api/competitions/<competition_id>/stages', methods=['GET', 'POST'])
def stages(competition_id):
    if request.method == 'GET':
        for comp in comps:
            if comp['competitionId'] == int(competition_id):
                return jsonify({'stages':comp['stages']})
        return jsonify({'status':'NoCompetition', 'msg':'Competition ID was not found.'}), 404

@app.route('/api/competitions', methods=['GET', 'POST'])
def all_competitions():
    if request.method == 'GET':
        return jsonify({'competitions':comps}), 200
    elif request.method == 'POST': 
        new_comp = request.json
        if 'competitionId' in new_comp:
            return jsonify({'status':'InvalidField', 'msg':'Competition ID cannot be provided in new competition.'})
        if 'name' not in new_comp:
            return jsonify({'status':'MissingField', 'msg':'A name must be provided in competition.'})
        new_comp['competitionId'] = comps[-1]['competitionId']+1
        comps.append(new_comp)
        return jsonify(new_comp),201


@app.route('/api/users', methods=['POST'])
def users_response():
    data = request.json
    new_user['userName'] = data['userName'] # safety from the unknown object being sent
    new_user['password'] = data['password']
    for user in users:
        if user['userName'] == new_user['userName']:
            return jsonify({'status':'UserExists', 'msg':'Username already exists.'}), 400
    nextID = users[-1]['userId']+1
    new_user['userId'] = nextID
    new_user['token'] = generateToken()
    users.append(new_user)
    return jsonify(new_user), 201


@app.route('/api/authentication', methods=['POST'])
def authenticate():
    user1 = request.json
    for user in users['users']:
        if user['userName'] == user1['userName'] and user['password'] == user1['password']:
            if 'token' not in user:
                user['token'] = generateToken()
            return jsonify(user), 200
    return jsonify({'status': 'NoUser', 'msg':'This user was not found in the database.'}), 404

if __name__ == '__main__':
    app.run(debug=True)

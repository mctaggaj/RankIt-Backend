from flask import Flask, jsonify, request
import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import database as db

#engine = create_engine('mysql+pymysql://blbadmin:Chickenpotpie1@beerleagueblog.ca/blb')
#Base = declarative_base()
#Base.metadata.reflect(engine)

adapter = db.CommunicationAdapter()

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
      "events": [
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
      "events": [
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

sessions = {}

app = Flask(__name__, static_url_path="", static_folder="package")

def generateToken():
    return uuid.uuid4().hex


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/competitions/<competition_id>/stages/<stage_id>/events', methods=['GET', 'POST'])
def events(competition_id, stage_id):
    if request.method == 'GET':
        for comp in comps:
            if comp['competitionId'] == int(competition_id):
                for stage in comp['stages']:
                    if stage['stageId'] == int(stage_id):
                        return jsonify({'events':stage['events']})
        return jsonify({'msg':'Competition or stage ID was not found'}), 404    
    elif request.method == 'POST':
        new_event = request.json
        if 'eventId' in new_event:
            return jsonify({'status':'InvalidField', 'msg':'Event Id cannot be provided in new stage.'}),400
        for comp in comps:
            if comp['competitionId'] == int(competition_id):
                for stage in comp['stages']:
                    if stage['stageId'] == int(stage_id):
                        if len(stage['events']) is 0:
                            new_event['eventId'] = 0
                        else:
                            new_event['eventId'] = stage['events'][-1]['eventId'] +1
                        stage['events'].append(new_event)
                        return jsonify(new_event), 201
        return jsonify({'msg':'Competition or stage ID not found'}), 404        


@app.route('/api/competitions/<competition_id>', methods=['GET', 'PUT'])
def competition(competition_id):
    if request.method == 'PUT':
        return "Not yet implemented", 501
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
    elif request.method == 'POST':
        new_stage = request.json
        if 'stageId' in new_stage:
            return jsonify({'status':'InvalidField', 'msg':'Stage ID cannot be provided in new stage.'}),400
        for comp in comps:
            if comp['competitionId'] == int(competition_id):
                if len(comp['stages']) is 0:
                    new_stage['stageId'] = 0
                else:
                    new_stage['stageId'] = comp['stages'][-1]['stageId'] + 1
                if 'events' not in new_stage:
                    new_stage['events'] = []
                comp['stages'].append(new_stage)
                return jsonify(new_stage), 201

    return jsonify({'status':'NoCompetition', 'msg':'Competition ID was not found.'}), 404

@app.route('/api/competitions/<competition_id>/stages/<stage_id>', methods=['GET', 'PUT'])
def single_stage(competition_id, stage_id):
    if request.method == 'GET':
        for comp in comps:
            if comp['competitionId'] == int(competition_id):
                for stage in comp['stages']:
                    if stage['stageId'] == int(stage_id):
                        return jsonify(stage)
        return jsonify({'msg':'Stage or competition resource not found'}), 404
                    
    else:
        return "Not yet implemented", 501

@app.route('/api/competitions', methods=['GET', 'POST'])
def all_competitions():
    if request.method == 'GET':
        return jsonify({'competitions':comps}), 200
    elif request.method == 'POST': 
        new_comp = request.json
        if 'stages' not in new_comp:
            new_comp['stages'] = []
        if 'competitionId' in new_comp:
            return jsonify({'status':'InvalidField', 'msg':'Competition ID cannot be provided in new competition.'}), 400
        if 'name' not in new_comp:
            return jsonify({'status':'MissingField', 'msg':'A name must be provided in competition.'}), 400
        new_comp['competitionId'] = comps[-1]['competitionId']+1
        comps.append(new_comp)
        return jsonify(new_comp),201


@app.route('/api/users', methods=['POST'])
def users_response():
    user = adapter.store_user(request)
    if user is not None:
        return jsonify(user), 201
    else:
        return jsonify({'status':'UserExists', 'msg':'Username already exists in database'})


@app.route('/api/authentication', methods=['POST', 'DELETE'])
def authenticate():
    if request.method == 'POST':
        user_req = request.json
        user = adapter.get_user_by_username(user_req['userName'])
        if user['userName'] == user_req['userName'] and user['password'] == user_req['password']:
            token = generateToken()
            sessions[token] = user['userId']
            return jsonify({"userId":user['userId'], 'token':token}), 200
        return jsonify({'status': 'AuthFailure', 'msg':'Authentication failed.'}),400
    elif request.method == 'DELETE':
        token = request.headers.get('X-Token')
        if token in sessions:
            del sessions[token]
        return jsonify({'msg':'Deauthenticated'}), 200

if __name__ == '__main__':
    app.run(debug=True)

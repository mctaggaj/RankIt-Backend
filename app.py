from flask import Flask, jsonify, request
import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

#engine = create_engine('mysql+pymysql://blbadmin:Chickenpotpie1@beerleagueblog.ca/blb')
#Base = declarative_base()
#Base.metadata.reflect(engine)

comps = { 'competitions': [{
"competitionId": "1",
"name": "Mario Cup",
"subject": "Mario Cart",
"description": "May the best nerd win",
"location": "Jason's House",
"public": True,
"results": "[]",
"state": "In Progress",
"participants": [
    {
        "userId": "user1",
        "competitionId": "c1",
        "compRoleId": "c1r1",
        "rank": 1,
        "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
            }
        },
    {
        "userId": "user2",
        "competitionId": "c1",
        "compRoleId": "c1r2",
        "rank": 2,
        "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
            }
        },
    {
        "userId": "user3",
        "competitionId": "c1",
        "compRoleId": "c1r3",
        "rank": 3,
        "permissions": {
            "admin": False,
            "judge": False,
            "competitor": True
            }
        },
    {
        "userId": "user4",
        "competitionId": "c1",
        "compRoleId": "c1r4",
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
            "stageId": "c1s1",
            "name": "Semi Finals",
            "description": "Elimination Round",
            "nextStage": "c1s2",
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
                    "userId": "user1",
                    "stageId": "c1s1",
                    "stageRoleId": "c1s1r1",
                    "rank": 1,
                    "permissions": {
                        "admin": False,
                        "judge": False,
                        "competitor": True
                        }
                    },
                {
                    "userId": "user2",
                    "stageId": "c1s1",
                    "stageRoleId": "c1s1r2",
                    "rank": 2,
                    "permissions": {
                        "admin": False,
                        "judge": False,
                        "competitor": True
                        }
                    },
                {
                    "userId": "user3",
                    "stageId": "c1s1",
                    "stageRoleId": "c1s1r3",
                    "rank": 3,
                    "permissions": {
                        "admin": False,
                        "judge": False,
                        "competitor": True
                        }
                    },
                {
                    "userId": "user4",
                    "stageId": "c1s1",
                    "stageRoleId": "c1s1r4",
                    "rank": 4,
                    "permissions": {
                        "admin": True,
                        "judge": True,
                        "competitor": True
                        }
                    }
                ],
            "results": [
                    "user1",
                    "user3",
                    "user2",
                    "user4"
                    ],
            "event": [
                    {
                        "eventId": "c1s1e1",
                        "name": "Race 1",
                        "location": "Mario Circut",
                        "parentStage": "c1s1",
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
                                "userId": "user1",
                                "eventId": "c1s1e1",
                                "eventRoleId": "c1s1e1r1",
                                "rank": 1,
                                "permissions": {
                                    "admin": False,
                                    "judge": False,
                                    "competitor": True
                                    }
                                },
                            {
                                "userId": "user4",
                                "eventId": "c1s1e1",
                                "eventRoleId": "c1s1e1r2",
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
                        "eventId": "c1s1e2",
                        "name": "Race 1",
                        "location": "Mario Circut",
                        "parentStage": "c1s1",
                        "state": "Completed",
                        "results": [
                            "user3",
                            "user2"
                            ],
                        "seed": [
                            2,
                            3
                            ],
                        "participants": [
                            {
                                "userId": "user2",
                                "eventId": "c1s1e2",
                                "eventRoleId": "c1s1e2r1",
                                "rank": 2,
                                "permissions": {
                                    "admin": False,
                                    "judge": False,
                                    "competitor": True
                                    }
                                },
                            {
                                "userId": "user3",
                                "eventId": "c1s1e3",
                                "eventRoleId": "c1s1e2r2",
                                "rank": 3,
                                "permissions": {
                                    "admin": False,
                                    "judge": False,
                                    "competitor": True
                                    }
                                },
                            {
                                "userId": "user4",
                                "eventId": "c1s1e2",
                                "eventRoleId": "c1s1e2r3",
                                "rank": -1,
                                "permissions": {
                                    "admin": True,
                                    "judge": True,
                                    "competitor": False
                                    }
                                }
                            ]
                        }
                    ],
    "parentCompetition": "c1"
  },
  {
          "stageId": "c1s2",
          "name": "Finals",
          "description": "Winner takes the cup",
          "previousStage": "c1s1",
          "location": "Mario Circut",
          "state": "In Progress",
          "seed": [
              1,
              2
              ],
          "participants": [
              {
                  "userId": "user1",
                  "stageId": "c1s2",
                  "stageRoleId": "c1s2r1",
                  "rank": 1,
                  "permissions": {
                      "admin": False,
                      "judge": False,
                      "competitor": True
                      }
                  },
              {
                  "userId": "user3",
                  "stageId": "c1s2",
                  "stageRoleId": "c1s2r2",
                  "rank": 2,
                  "permissions": {
                      "admin": False,
                      "judge": False,
                      "competitor": True
                      }
                  },
              {
                  "userId": "user4",
                  "stageId": "c1s2",
                  "stageRoleId": "c1s2r3",
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
                  "eventId": "c1s2e1",
                  "name": "Fianl Race",
                  "location": "Mario Circut",
                  "parentStage": "c1s2",
                  "state": "In Progress",
                  "seed": [
                      1,
                      4
                      ],
                  "participants": [
                      {
                          "userId": "user1",
                          "eventId": "c1s2e1",
                          "eventRoleId": "c1s2e1r1",
                          "rank": 1,
                          "permissions": {
                              "admin": False,
                              "judge": False,
                              "competitor": True
                              }
                          },
                      {
                          "userId": "user3",
                          "eventId": "c1s2e1",
                          "eventRoleId": "c1s2e1r2",
                          "rank": 2,
                          "permissions": {
                              "admin": False,
                              "judge": False,
                              "competitor": True
                              }
                          },
                      {
                          "userId": "user4",
                          "eventId": "c1s2e1",
                          "eventRoleId": "c1s2e1r3",
                          "rank": -1,
                          "permissions": {
                              "admin": True,
                              "judge": True,
                              "competitor": False
                              }
                          }
                      ]
                  }
              ],
          "parentCompetition": "c1"
  }
]
}]};

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
        for competition in comp:
            if competition['competitionId'] == competition_id:
                return jsonify({'competition': competition, 'status': 'OK'})
        return jsonify({'status': 'NoCompetition', 'msg': 'Competition ID was not found.'}), 404

@app.route('/api/competitions', methods=['GET', 'POST'])
def all_competitions():
    if request.method == 'GET':
        return jsonify(comps), 200
    elif request.method == 'POST': # todo, doesnt currently create
        new_comp = request.json
        if 'competitionId' in new_comp:
            return jsonify({'status':'InvalidField', 'msg':'Competition ID cannot be provided in new competition.'})
        if 'name' not in new_comp:
            return jsonify({'status':'MissingField', 'msg':'A name must be provided in competition.'})
        new_comp['competitionId'] = comp[-1]['competitionId']+1
        comp.append(new_comp)
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
            # uj = {'userName':user['userName'], "userId":user['userId'], 'token':user['token']}
            return jsonify(user), 200
    return jsonify({'status': 'NoUser', 'msg':'This user was not found in the database.'}), 404

if __name__ == '__main__':
    app.run(debug=True)

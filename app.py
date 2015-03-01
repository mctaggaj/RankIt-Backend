#RESTful Web Service
#Written by: Shawn Hind
from flask import Flask, jsonify, request
import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import database as db

adapter = db.DatabaseAdapter()

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
        session = db.Session()
        events = adapter.get_all_events_by_stageid(stage_id, session)
        events_dicts = []
        for event in events:
            events_dicts.append(db.to_dict(event))
        session.close()
        return jsonify({'events':events_dicts})
    elif request.method == 'POST':
        new_event = request.json
        if 'eventId' in new_event:
            return jsonify({'status':'InvalidField', 'msg':'Event Id cannot be provided in new stage.'}),400
        session = db.Session()
        added = adapter.store_event(new_event, stage_id, session)
        if added is not None:
            converted = db.to_dict(added)
            session.close()
            return jsonify(converted), 201
        return jsonify({'msg':'Competition or stage ID not found'}), 404


@app.route('/api/competitions/<competition_id>', methods=['GET', 'PUT'])
def competition(competition_id):
    if request.method == 'PUT':
        return "Not yet implemented", 501
    elif request.method == 'GET':
        session = db.Session()
        comp = adapter.get_competition_by_compid(competition_id, session)
        if comp is None:
            session.close()
            return jsonify({'status': 'NoCompetition', 'msg': 'Competition ID was not found.'}), 404
        comp_dict = db.to_dict(comp)
        session.close()
        return jsonify(comp_dict)
    
@app.route('/api/events/<event_id>', methods=['GET', 'PUT'])
def event(event_id):
    if request.method == 'PUT':
        return "Not yet implemented", 501
    elif request.method == 'GET':
        session = db.Session()
        event = adapter.get_event_by_eventid(event_id, session)
        if event is None:
            session.close()
            return jsonify({'status': 'NoCompetition', 'msg': 'Event ID was not found.'}), 404
        event_dict = db.to_dict(event)
        session.close()
        return jsonify(event_dict)

@app.route('/api/competitions/<competition_id>/stages', methods=['GET', 'POST'])
def stages(competition_id):
    if request.method == 'GET':
        session = db.Session()
        stages = adapter.get_all_stages_by_compid(competition_id, session)
        stages_dicts = []
        for stage in stages:
            stages_dicts.append(db.to_dict(stage))
        session.close()
        return jsonify({'stages':stages_dicts})
    elif request.method == 'POST':
        new_stage = request.json
        if 'stageId' in new_stage:
            return jsonify({'status':'InvalidField', 'msg':'Stage ID cannot be provided in new stage.'}),400
        session = db.Session()
        new_stage = adapter.store_stage(new_stage, competition_id, session)
        return jsonify(db.to_dict(new_stage)), 201

    return jsonify({'status':'NoCompetition', 'msg':'Competition ID was not found.'}), 404
#Todo Update documentation with new url
@app.route('/api/stages/<stage_id>', methods=['GET', 'PUT'])
def single_stage(stage_id):
    if request.method == 'GET':
        session = db.Session()
        stage = adapter.get_stage_by_stageid(stage_id, session)
        if stage is None:
            session.close()
            return jsonify({'status': 'NoStage', 'msg': 'Stage ID was not found.'}), 404
        stage_dict = db.to_dict(stage)
        session.close()
        return jsonify(stage_dict)

    else:
        return "Not yet implemented", 501

@app.route('/api/competitions', methods=['GET', 'POST'])
def all_competitions():
    if request.method == 'GET':
        session = db.Session()
        comps = adapter.get_all_competitions(session)
        comps_dict = []
        for comp in comps:
            comps_dict.append(db.to_dict(comp))
        session.close()
        return jsonify({'competitions':comps_dict}), 200
    elif request.method == 'POST':
        new_comp = request.json
        if 'competitionId' in new_comp:
            return jsonify({'status':'InvalidField', 'msg':'Competition ID cannot be provided in new competition.'}), 400
        if 'name' not in new_comp:
            return jsonify({'status':'MissingField', 'msg':'A name must be provided in competition.'}), 400
        token = request.headers.get('X-Token')
        if token not in sessions:
            return jsonify({'msg':'Authentication is not valid'})
        session = db.Session()
        comp = adapter.store_competition(new_comp, sessions[token], session)
        if comp is not None:
            comp_dict = db.to_dict(comp)
        else:
            comp_dict = {'msg':'Competition creation failed'}
            session.close()
            return jsonify(comp_dict),400
        session.close()
        return jsonify(comp_dict),201


@app.route('/api/users', methods=['POST'])
def users_response():
    session = db.Session()
    u = adapter.store_user(request.json, session)
    if u is not None:
        user = db.to_dict(u)
    else:
        return jsonify({'status':'UserExists', 'msg':'Username already exists in database'})
    session.close()
    return jsonify(user), 201

@app.route('/api/users/<user_id>')
def get_user(user_id):
    session = db.Session()
    user = adapter.get_user_by_userid(user_id)
    if user is not None:
        user_dict = db.to_dict(user)
        session.close()
        return jsonify(user)
    else:
        session.close()
        return jsonify({'msg':'User was not found'})

@app.route('/api/authentication', methods=['POST', 'DELETE'])
def authenticate():
    if request.method == 'POST':
        user_req = request.json
        session = db.Session()
        user = db.to_dict(adapter.get_user_by_username(user_req['userName'], session))
        session.close()
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

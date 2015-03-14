#RESTful Web Service
#Written by: Shawn Hind
from flask import Flask, jsonify, request
import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

import database as db
import authentication as auth
from authentication import AuthType
from authentication import AuthLevel


sessions = {}

app = Flask(__name__, static_url_path="", static_folder="package")

def generateToken():
    return uuid.uuid4().hex

def get_userid(token):
    try:
        return sessions[token]
    except KeyError:
        return None

def check_loggedin(token):
    return (True if token in sessions else False)
    

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/competitions/<competition_id>/stages/<stage_id>/events', methods=['GET', 'POST'])
def events(competition_id, stage_id):
    if request.method == 'GET':
        session = db.Session()
        events = db.get_all_events_by_stageid(stage_id, session)
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
        added = db.store_event(new_event, stage_id, session)
        if added is not None:
            converted = db.to_dict(added)
            session.close()
            return jsonify(converted), 201
        return jsonify({'msg':'Competition or stage ID not found'}), 404


@app.route('/api/competitions/<competition_id>', methods=['GET', 'PUT'])
def competition(competition_id):
    if request.method == 'PUT':
        comp_dic = request.json
        session = db.Session()
        edited_comp = db.edit_competition(comp_dic, competition_id, session)
        if edited_comp is not None:
            edited_dic = db.to_dict(edited_comp)
            session.close()
            return jsonify(edited_dic)
        session.close()
        return jsonify({'status': 'NoCompetition', 'msg':'Competition ID was not found'}), 404

    elif request.method == 'GET':
        session = db.Session()
        token = request.headers.get('X-Token')
        userid = get_userid(token)
        visible = auth.check_auth(userid, competition_id, AuthType.competition, AuthLevel.membership)
        comp = db.get_competition_by_compid(competition_id, session)
        if comp.public == False and visible == False:
            return jsonify({'status': 'InvalidPermissions', 'msg':'No permissions to view this object.'}), 404
        if comp is None:
            session.close()
            return jsonify({'status': 'NoCompetition', 'msg': 'Competition ID was not found.'}), 404
        comp_dict = db.to_dict(comp)
        session.close()
        return jsonify(comp_dict)
    
@app.route('/api/events/<event_id>', methods=['GET', 'PUT'])
def event(event_id):
    if request.method == 'PUT':
        session = db.Session()
        edited_dic = request.json
        edited_event = db.edit_event(edited_dic, event_id, session)
        if edited_event == None:
            session.close()
            return jsonify({'status': 'NoCompetition', 'msg': 'Event ID was not found.'}), 404
        edited_event_dic = db.to_dict(edited_event)
        session.close()
        return jsonify(edited_event_dic)
    elif request.method == 'GET':
        session = db.Session()
        event = db.get_event_by_eventid(event_id, session)
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
        stages = db.get_all_stages_by_compid(competition_id, session)
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
        new_stage = db.store_stage(new_stage, competition_id, session)
        new_stage_dict = db.to_dict(new_stage)
        session.close()
        return jsonify(new_stage_dict), 201

    return jsonify({'status':'NoCompetition', 'msg':'Competition ID was not found.'}), 404

@app.route('/api/stages/<stage_id>', methods=['GET', 'PUT'])
def single_stage(stage_id):
    if request.method == 'PUT':
        session = db.Session()
        edited_dic = request.json
        edited_stage = db.edit_stage(edited_dic, stage_id, session)
        if edited_stage == None:
            session.close()
            return jsonify({'status': 'NoStage', 'msg':'Stage ID was not found.'}), 404
        edited_stage_dic = db.to_dict(edited_stage)
        session.close()
        return jsonify(edited_stage_dic)

    if request.method == 'GET':
        session = db.Session()
        stage = db.get_stage_by_stageid(stage_id, session)
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
        token = request.headers.get('X-Token')
        userid = get_userid(token)
        session = db.Session()
        comps = db.get_all_competitions(session, userid)
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
        if check_loggedin(token) == False:
            return jsonify({'msg':'Authentication is not valid'})
        userid = get_userid(token)
        session = db.Session()
        comp = db.store_competition(new_comp, userid, session)
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
    u = db.store_user(request.json, session)
    if u is not None:
        user = db.to_dict(u)
    else:
        return jsonify({'status':'UserExists', 'msg':'Username already exists in database'})
    session.close()
    return jsonify(user), 201

@app.route('/api/users/<user_id>')
def get_user(user_id):
    session = db.Session()
    user = db.get_user_by_userid(user_id)
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
        user = db.get_user_by_username(user_req['userName'], session)
        if user is not None:
            user = db.to_dict(user)
            if user['userName'] == user_req['userName'] and user['password'] == user_req['password']:
                token = generateToken()
                sessions[token] = user['userId']
                session.close()
                return jsonify({"userId":user['userId'], 'token':token}), 200
        session.close()
        return jsonify({'status': 'AuthFailure', 'msg':'Authentication failed.'}),400
    elif request.method == 'DELETE':
        token = request.headers.get('X-Token')
        if token in sessions:
            del sessions[token]
        return jsonify({'msg':'Deauthenticated'}), 200

if __name__ == '__main__':
    app.run(debug=True)

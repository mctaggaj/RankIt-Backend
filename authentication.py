#Authentication Checking Module
#Written by: Shawn Hind
from enum import Enum
import database as db

class AuthType(Enum):
    competition = 0
    stage = 1
    event = 2

class AuthLevel(Enum):
    competitor = 0
    judge = 1
    admin = 2
    membership = 3

def check_auth(userid, thing_id, auth_type, auth_level):
    if auth_type == AuthType.competition:
        auth_retrieval = db.get_competition_auth
    elif auth_type == AuthType.stage:
        auth_retrieval = db.get_stage_auth
    elif auth_type == AuthType.event:
        auth_retrieval = db.get_event_auth
    else:
        return False

    session = db.Session()
    role = auth_retrieval(thing_id, userid, session)
    if role == None:
        session.close()
        return False

    if auth_level == AuthLevel.competitor:
        permission_check = db.check_competitor
    elif auth_level == AuthLevel.judge:
        permission_check = db.check_judge
    elif auth_level == AuthLevel.admin:
        permission_check = db.check_admin
    #If checking for membership, anyone with a role existing is a member
    elif auth_level == AuthLevel.membership:
        session.close()
        return True

    session.close()
    return permission_check(role)

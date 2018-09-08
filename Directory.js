'use strict';

function Directory(flags){
    this.flags  = { };
    this.groups = { };
    this.users  = [ ];

    for(let i = 0, len = flags.length; i < len; i++){
        const flag = flags[i];

        this.flags[flag] = 2**i;
    }

    return this;
}

Directory.prototype.addGroup = function addGroup(name, flags){
    this.groups[name] = 0;

    for(let flag of flags){
        if(flag in this.flags){
            this.groups[name] |= this.flags[flag];
        }
    }
}

Directory.prototype.removeGroup = function removeGroup(name){
    if(name in this.groups){
        delete this.groups[name];
    }
}

Directory.prototype.addUser = function addUser(name){
    const user = new User(name, this);

    this.users.push(user);

    return user;
}


function User(name, directory){
    this.name      = name;
    this.uac       = 0;
    this.directory = directory;

    return this;
}

User.prototype.addFlag = function addFlag(flag){
    if(flag in this.directory.flags){
        this.uac |= this.directory.flags[flag];
    }
}

User.prototype.removeFlag = function removeFlag(flag){
    if(flag in this.directory.flags){
        /*
            n &= ~(mask)
            This works by ensuring that the mask bit
            is off by inversing it then AND the
            numbers together
        */
        this.uac &= ~this.directory.flags[flag];
    }
}

User.prototype.toggleFlag = function toggleFlag(flag){
    if(flag in this.directory.flags){
        this.uac ^= this.directory.flags[flag];
    }
}

User.prototype.hasFlag = function hasFlag(flag){
    if(flag in this.directory.flags){
        return !!(this.directory.flags[flag] & this.uac);
    }
    return false;
}

User.prototype.applyGroupFlags = function applyGroupFlags(group){
    if(group in this.directory.groups){
        this.uac |= this.directory.groups[group];
    }
}

User.prototype.removeGroupFlags = function removeGroupFlags(group){
    if(group in this.directory.groups){
        this.uac &= ~this.directory.groups[group];
    }
}

module.exports = { Directory }

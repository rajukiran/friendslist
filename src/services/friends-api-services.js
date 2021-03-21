const apiServices = {
    getListOfFriends: function() {
        return fetch("./mocdata/friendslist.json");
    }
}

export default apiServices;
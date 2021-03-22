import React, { useState, useEffect } from 'react';
import './FriendsList.css';
import apiServices from "../services/friends-api-services";

/***
 * Friend - Component
 * @param friendData - Friend data of JSON Object
 * @param favoriteTask - Method to toggle favorite
 * @param removeFriend - Method to remove Friend from list
 * @param display - variable to show / hide a friend data
 */
function Friend({ friendData, index, favoriteTask, removeFriend, display }) {
    return (
        display ?
            (
                <div id="info-container">
                    <div id="friend-info">
                        <div style={{fontWeight: 'bold'}}>{friendData.name}</div>
                        <br />
                        <div style={{color: '#868181'}}>
                            is your friend
                        </div>
                    </div>
                    <div id="action-btn">
                        <button onClick={() => favoriteTask(friendData.name)} style={{padding: 5}}><img src={friendData.favorite ? "./favorite-selected.png" : "favorite.png"} alt="Favorite" height="20" width="30" /></button>
                        <button style={{marginLeft: 10, padding: 5}} onClick={() => removeFriend(friendData.name)}><img src={"./delete.png"} alt="Delete" height="20" width="30" /></button>
                    </div>
                </div>
            ) : null
    );
}

/***
 * CreateFriend - Input component
 * @param addFriend parent method to create a friend 
 * @param filterFriendList parent method to filter friends
 * @param fiends fiends data to check whether exists or not before create
 */
function CreateFriend({ addFriend, filterFriendList, friends }) {
    const [value, setValue] = useState("");

    const createFriend = e => {
        e.preventDefault();
        if (!value || friends.filter(el => el.name.toLowerCase() === value.toLowerCase()).length) return;
        addFriend(value);
        setValue("");
    }
    return (
        <form onSubmit={createFriend}>
            <input
                type="text"
                className="input-friend"
                value={value}
                placeholder="Enter your friend's name"
                onChange={e => setValue(e.target.value)}
                onKeyUp={e => filterFriendList(e.target.value)}
            />
        </form>
    );
}

/***
 * FriendsList - Component 
 * Parent component to generate list of available friends
 */
function FriendsList() {
    var [friends, setTasks] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [friendsPerPage, setFriendsPerPage] = useState(4);

    const [filterName, setFilterName] = useState("");

    const pages = [4];

    useEffect(() => {
        apiServices.getListOfFriends()
            .then(res => res.json())
            .then(res => setTasks(res.data));
        return () => {}
    }, [])

    const addFriend = name => {
        const newFriends = [...friends, { name, favorite: false, show: true }];
        newFriends.sort((firstValue, secondValue) => firstValue.favorite - secondValue.favorite)
        setTasks(newFriends);
    };

    const favoriteTask = friendName => {
        const newFriends = [...friends];
        const index = newFriends.findIndex(el => el.name === friendName)
        newFriends[index].favorite = !newFriends[index].favorite;
        newFriends.sort((firstValue, secondValue) => firstValue.favorite - secondValue.favorite)
        setTasks(newFriends);
    };

    const removeFriend = friendName => {
        const newFriends = [...friends];
        const index = newFriends.findIndex(el => el.name === friendName)
        newFriends.splice(index, 1);
        const validData = (currentPage - 1) * friendsPerPage;
        if (newFriends.length === validData) {
            setCurrentPage(currentPage - 1);
        }
        setTasks(newFriends);
    };

    const filterFriendList = text => {
        let newFriends = [...friends];
        setFilterName(text);
        if (text.length === 0) {
            newFriends.forEach(value => {
                value.show = true;
            })
            setTasks(newFriends);
            return;
        }
        newFriends.forEach(el => el.show = el.name.toLowerCase().includes(text.toLowerCase()));
        setTasks(newFriends);
    }

    const pageNumbers = [];
    const availableTasks = friends.filter(el => el.show);
    for (let i = 1; i <= Math.ceil(availableTasks.length / friendsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(pageNumber => {
        return (
            <li
                style={pageNumber === currentPage ? { background: 'black', borderRadius: 5, padding: 5 } : { padding: 5, color: 'black' }}
                key={pageNumber}
                id={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
            >
                {pageNumber}
            </li>
        );
    });

    function pageChange(event) {
        setFriendsPerPage(event.target.value);
    }

    // Logic for displaying current todos
    const processFriendsListWithFavorite = friends.filter(el => el.show).sort((a, b) => b.favorite - a.favorite);
    const indexOfLastFriend = currentPage * friendsPerPage;
    const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
    const currentPageFriends = (filterName && filterName.length) || indexOfFirstFriend < 0 ? processFriendsListWithFavorite : processFriendsListWithFavorite.slice(indexOfFirstFriend, indexOfLastFriend);

    return (
        <div className="friends-container">
            <h2 style={{color: 'black', marginLeft: 13, background: 'lightgrey', margin: 0, padding: 10}}>Friends List</h2>
            <div className="create-friend" style={{marginLeft: 5}}>
                <CreateFriend addFriend={addFriend} filterFriendList={filterFriendList} friends={friends} />
            </div>
            <div className="friends">
                {currentPageFriends.map((friendData, index) => (
                    <Friend
                        friendData={friendData}
                        index={index}
                        favoriteTask={favoriteTask}
                        removeFriend={removeFriend}
                        key={index}
                        display={friendData.show}
                    />
                ))}
                <div style={currentPageFriends.length === 0 ? {display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340} : {display: 'none'}}>
                    <div style={{color: 'black'}}>No friend found...</div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                {friends.length > 4 ? <ul id="page-numbers">
                    {renderPageNumbers}
                </ul> : null}

                {friends.length > 4 ? <div className="page-dropdown" style={{ marginLeft: 'auto', padding: 20 }}><span style={{color: 'black', fontSize: 12}}>Page Size: </span><select
                    defaultValue={friendsPerPage}
                    onChange={pageChange}
                >
                    {
                        pages.map(item => {
                            return (
                                <option value={item} key={item}>{item}</option>
                            )
                        })
                    }
                </select></div> : null}
            </div>
        </div>
    );
}

//To avoid multiple calls of Virtual DOM comparision with Real DOM & re-render - (Memorized component)
export default React.memo(FriendsList);
import React , { useState, useEffect } from "react";

const Profile = (props) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUserProfile();
    }, []);

    function loadUserProfile () {
        props.auth.getProfile((profile, error) => {
            setProfile(profile);
            setError(error);
        });
    }

    return !profile ? null : (
        <React.Fragment>
          <h1>Profile</h1>
          <p>{profile.nickname}</p>
          <img
            style={{ maxWidth: 50, maxHeight: 50}}
            src={profile.picture}
            alt="profile pic"/>

            <pre>{JSON.stringify(profile, null, 2 )}</pre>
        </React.Fragment>
       
     );
}

export default Profile;
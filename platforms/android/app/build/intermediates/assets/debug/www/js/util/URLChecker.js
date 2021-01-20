var url = new URL(window.location.href);


if (url.searchParams.get('P') != null) {
    parameters = url.searchParams.get('P');
    var parametersObj = JSON.parse( parameters );
    for (key in parametersObj)
    {
        setAWBEStorage(key,parametersObj[key],false);
    }
} else {
    //Exception
        console.log("Error: no parameters in url, using all default");
        setAWBEStorage('EWA',false,false);
        setAWBEStorage('QRCODE',false,false);
        setAWBEStorage('SMIC',false,false);
}

if (url.searchParams.get('HASH_PUSH') == null) {
    AWBE.localStorage.setItem('HASH_PUSH', "");
} else {
    AWBE.localStorage.setItem('HASH_PUSH', (url.searchParams.get('HASH_PUSH').toString()));
    }

    function setAWBEStorage(key,value,session,description){
        description = description || key; //Default value of description is the key
        if (session)
            AWBE.sessionStorage.setItem(key, value);
        else
            AWBE.localStorage.setItem(key, value);

        console.log(description+': '+value);
    }

function setAWBEStorage(key,value,session,description){
    description = description || key; //Default value of description is the key
    if (session)
        AWBE.sessionStorage.setItem(key, value);
    else
        AWBE.localStorage.setItem(key, value);

    console.log(description+': '+value);
  }


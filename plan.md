[-] Fontend
[-]    drawing
[-]        customizable pens
[-]            pen
[-]            monoline
[-]            calligraphy
[-]        select tool
[-]            change color
[-]            change tool
[-]            move around
[-]            delete
[-]        eraser
[-]            pixel erase
[-]            object erase
[-]        touch detection
[-]            mouse
[-]            apple pencil
[-]            finger
[-]        toolbar
[-]            history
[-]                go back
[-]                go forward
[-]            tools
[-]                pick
[-]                alter
[-]                    color
[-]                    width
[-]                    speed sensitivity -- if pen
[-]                    angle sensitivity -- if calligraphy
[-]                    smoothness ?
[-]                remove from list
[-]            colors
[-]                pick
[-]                add
[-]                remove
[-]                select custom
[-]        history = actions
[-]            registered
[-]                sent to server
[-]                kept in list
[-]            if no internet
[-]                save to localStorage
[-]                then send it to server
[-]    file management
[-]        new file
[-]            schemes?
[-]        delete file
[-]        rename file
[-]        check file data
[-]            last modified
[-]            creation date 
[-]            creator
[-]        rename
[-]        tags
[-]            assign to file
[-]            disassign from file
[-]            create new to file
[-]        export
[-]            to json -- for local file saving
[-]            to svg
[-]            to pdf
[-]        share?
[-]        duplicate 
[-]        pin/unpin
[-]    local storage
[+]        store logged in users
[+]        store active user id
[-]        store actions if no internet
[+]        store file previews
[+]    load
[+]        attempt logging in to account in local storage
[+]        save new user data to local storage if login is successful
[+]        get recently altered file previews of user if login is successful
[+]        show files
[+]        show tags -- union of files' tags
[-]     user management
[+]         logout


[-] Backend
[-]     tags
[-]         new tag
[-]         rename tag
[-]         delete tag
[-]     user management -- see shared > user management
[-]     file management
[-]         tables
[-]             files
[-]             users
[-]             actions
[-]             tags
[-]         apis
[+]             get file
[-]             delete file
[+]             update file
[-]             close file
[-]             register action 
[-]                 actions
[-]                     strokes moved around
[-]                     strokes' color changed
[-]                     strokes' tool changed
[-]                     strokes deleted
[-]                     new stroke created
[-]                     new tool added
[-]                     tool altered
[-]                     tool removed
[-]                     color added
[-]                     color altered
[-]                     color removed
[-]                 actions saved to actions table
[-]                 when close file api is called: act out 
[-]                 acting out
[-]                     virtually open file
[-]                     get all changes from actions table
[-]                     act all actions
[-]                     export file
[-]                     save file
[-]                     if successful, delete relevant actions from actions table

[-] Shared
[-]     user management
[+]         login
[+]         new profile
[+]         delete profile
[+]         change profile data
[+]             name
[+]             password
[+]             color scheme

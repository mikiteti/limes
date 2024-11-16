const boring = {
    log_response(res) {
        if (res.error) {
            console.log({error: res.error});
            ui.message(res.error.name, "error");
            delete res.error;
            return "error";
        }
        if (res.success) {
            console.log({success: res.success});
            delete res.success;
        }
    },
};

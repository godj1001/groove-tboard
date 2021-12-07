const eventBus = {};

const on = (event, callback) => {
    if (eventBus[event]) {
        eventBus[event].push(callback);
    } else {
        eventBus[event] = [callback];
    }
};

const emit = (event, data) => {
    let eventList = eventBus[event] || [];

    for (let item of eventList) {
        item(data);
    }
};

export {
    on,
    emit
};
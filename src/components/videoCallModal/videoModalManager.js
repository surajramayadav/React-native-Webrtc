class VideoManager {
    _defaultAlert = null;
    register(_ref) {
        this._defaultAlert = _ref;
    }
    unregister(_ref) {
        this._defaultAlert = null;
    }
    getDefault() {
        return this._defaultAlert;
    }
}

export default new VideoManager();
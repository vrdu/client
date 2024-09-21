class user {
      constructor(data = {}) {
        this.username = null;
        Object.assign(this, data);
      }
    }
    export default user;
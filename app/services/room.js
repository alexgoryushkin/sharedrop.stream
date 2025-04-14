import $ from 'jquery';
import {
  ref,
  onValue,
  onDisconnect,
  set,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  update,
  remove
} from 'firebase/database';

// TODO: use Ember.Object.extend()
const Room = function (name, db) {
  this.db = db;
  this.name = name;
};

Room.prototype.join = function (user) {
  const self = this;

  // Setup Firebase refs
  self._connectionRef = ref(self.db, '.info/connected');
  self._roomRef = ref(self.db, `rooms/${this.name}`);
  self._usersRef = ref(self.db, `rooms/${this.name}/users`);
  self._userRef = ref(self.db, `rooms/${this.name}/users/${user.uuid}`);

  console.log('Room:\t Connecting to: ', this.name);

  onValue(self._connectionRef, (connectionSnapshot) => {
    // Once connected (or reconnected) to Firebase
    if (connectionSnapshot.val() === true) {
      console.log('Firebase: (Re)Connected');

      // Remove yourself from the room when disconnected
      onDisconnect(self._userRef).remove();

      // Join the room
      set(self._userRef, user)
        .then(() => {
          console.log('Firebase: User added to the room');
          // Create a copy of user data,
          // so that deleting properties won't affect the original variable
          $.publish('connected.room', $.extend(true, {}, user));
        })
        .catch((error) => {
          console.warn('Firebase: Adding user to the room failed: ', error);
        });

      onChildAdded(self._usersRef, (userAddedSnapshot) => {
        const addedUser = userAddedSnapshot.val();

        console.log('Room:\t user_added: ', addedUser);
        $.publish('user_added.room', addedUser);
      });

      onChildRemoved(self._usersRef, (userRemovedSnapshot) => {
          const removedUser = userRemovedSnapshot.val();

          console.log('Room:\t user_removed: ', removedUser);
          $.publish('user_removed.room', removedUser);
        },
        () => {
          // Handle case when the whole room is removed from Firebase
          $.publish('disconnected.room');
        });

      onChildChanged(self._usersRef, (userChangedSnapshot) => {
        const changedUser = userChangedSnapshot.val();

        console.log('Room:\t user_changed: ', changedUser);
        $.publish('user_changed.room', changedUser);
      });
    } else {
      console.log('Firebase: Disconnected');

      $.publish('disconnected.room');
    }
  });

  return this;
};

Room.prototype.update = function (attrs) {
  update(this._userRef, attrs);
};

Room.prototype.leave = function () {
  remove(this._userRef);
};
export default Room;

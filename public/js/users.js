/* globals $ io toastr requester domAppender */
// eslint-disable-next-line
var socket = io.connect('http://localhost:3001');

$(() => {
    $('#alert-dropdown').on('click', (event) => {
        event.preventDefault();
        $('.notification-alert').addClass('hidden');

        if ($('#alerts').children().length > 1) {
            $('#no-alert').addClass('hidden');
        } else {
            $('#no-alert').removeClass('hidden');
        }
    });

    $('#alerts').on('click', '.alert', (event) => {
        event.preventDefault();
        event.stopPropagation();

        $(event.target).parent().remove();
        if ($('#alerts').children().length === 1) {
            $('#no-alert').removeClass('hidden');
        }

        socket.emit('remove-notification', $(event.target).first().html());
    });

    $('.container').on('click', '#add-friend', (event) => {
        event.preventDefault();

        const friendId = $(event.target)
            .html('Chat')
            .attr('id', 'chat')
            .parents('.user-id')
            .attr('user-id');

        socket.emit('add-friend', friendId);
        toastr.success('You added new friend!');
    });

    socket.on('add-friend', (sender) => {
        $('.user-id[user-id=' + sender._id.toString() + ']')
            .find('#add-friend')
            .html('Chat')
            .attr('id', 'chat');

        domAppender.appendNotification(
            'glyphicon-user',
            `${sender.username} added you as a friend!`);
    });

    $('#users-search').on('click', () => {
        requester.getJSON('/api/users')
            .then((users) => {
                return users.map((x) => x.username);
            })
            .then((usernames) => {
                $('#users-search').autocomplete({
                    source: usernames,
                });
            });
    });

    $('#users-container').on('click', '.btn-promote-admin', (ev) => {
        const $clickedButton = $(ev.target);
        const userToPromoteId = $clickedButton
            .attr('data-user-id');

        const url = 'http://localhost:3001/api/users/' + userToPromoteId + '/admin';
        requester.putJSON(url)
            .then((res) => {
                toastr.success('Requested user is now an admin!');
                $clickedButton.hide();
            })
            .catch((err) => {
                toastr.error('You do not have rights to promote users!');
            });
    });
});

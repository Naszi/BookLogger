(function() {

    angular.module('app')
        .controller('BooksController', ['$q', 'books', 'dataService', 'badgeService', '$cookies', '$cookieStore', '$log', '$route', 'currentUser', BooksController]);


    function BooksController($q, books, dataService, badgeService, $cookies, $cookieStore, $log, $route, currentUser) {

        var vm = this;

        vm.appName = books.appName;

        dataService.getUserSummary()
            .then(getUserSummarySuccess);

        function getUserSummarySuccess(summaryData) {
            vm.summaryData = summaryData;
        }


        dataService.getAllBooks()
            .then(getBooksSuccess, null, getBooksNotification)
            .catch(errorCallback)
            .finally(getAllBooksComplete);

        function getBooksSuccess(books) {
            vm.allBooks = books;
        }

        function getBooksNotification(notification) {
        }

        function errorCallback(errorMsg) {
            console.log('Error Message: ' + errorMsg);
        }

        function getAllBooksComplete() {
        }

        dataService.getAllReaders()
            .then(getReadersSuccess)
            .catch(errorCallback)
            .finally(getAllReadersComplete);

        function getReadersSuccess(readers) {
            vm.allReaders = readers;
        }

        function getAllReadersComplete() {
            $log.awesome('All readers retrieved');
        }

        vm.getBadge = badgeService.retrieveBadge;

        vm.favoriteBook = $cookies.favoriteBook;

        vm.currentUser = currentUser;

        vm.deleteBook = function (bookID) {

            dataService.deleteBook(bookID)
                .then(deleteBookSuccess)
                .catch(deleteBookError);

        };

        function deleteBookSuccess(message) {
            $log.info(message);
            $route.reload();
        }

        function deleteBookError(errorMessage) {
            $log.error(errorMessage);
        }

    }

}());
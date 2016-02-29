app.controller('employeesController', function($scope, $http, API_URL) {
    //retrieve employees listing from API
    $http.get(API_URL + "employees")
        .success(function(response) {
            $scope.employees = response;
        });

    //show modal form
    $scope.toggle = function(modalstate, id) {
        $scope.modalstate = modalstate;

        switch (modalstate) {
            case 'add':
                $scope.employee = null;
                $scope.form_title = "Add New Employee";
                break;
            case 'edit':
                $scope.form_title = "Employee Detail";
                $scope.id = id;
                $http.get(API_URL + 'employees/' + id)
                    .success(function(response) {
                        console.log(response);
                        $("#myModal").show();
                        $scope.employee = response;
                    });
                break;
            default:
                break;
        }
        console.log(id);

    };

    //save new record / update existing record
    $scope.save = function(modalstate, id) {
        var url = API_URL + "employees";

        //append employee id to the URL if the form is in edit mode
        if (modalstate === 'edit'){
            url += "/" + id;
        }

        $http({
            method: 'POST',
            url: url,
            data: $.param($scope.employee),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(response) {
            console.log(response);
            $http.get(API_URL + 'employees')
                .success(function(getData){
                    $scope.employees = getData;
                    location.reload();
                });
        }).error(function(response) {
            console.log(response);
            alert('This is embarassing. An error has occured. Please check the log for details');
        });
    }

    //delete record
    $scope.confirmDelete = function(id) {
        var isConfirmDelete = confirm('Are you sure you want this record?');
        if (isConfirmDelete) {
            $http({
                method: 'DELETE',
                url: API_URL + 'employees/delete/' + id
            }).
            success(function(data) {
                console.log(data);
                $http.get(API_URL + 'employees')
                    .success(function(data){
                        $scope.employees = data;
                    });
            }).
            error(function(data) {
                console.log(data);
                alert('Unable to delete');
            });
        } else {
            return false;
        }
    }

    $scope.empty = function(){
        $scope.employee = null;
    }
});

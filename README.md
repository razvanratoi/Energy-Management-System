# Building and Execution of the Energy Management System Application

To get the project working, the following steps should be done:
* Create a folder (`your-folder`) where you want to keep the app, and inside this one, 2 more folders: `ds-front` and `ds-back-users`.
* Open a terminal and insert the following commands to:
    * create an Angular project:
    ```console
    ng new <project-name>
    ```
    * add Angular Material to the project (inside the `ds-front` directory)
    ```console
    ng add @angular/material
    ```
    * create a .NET project for the Users MicroService (inside the `ds-back-users` directory)
    ```console
    dotnet new webapi UsersMicroservice
    ```
    * create a .NET project for the Device MicroService (inside the `ds-back-users` directory)
    ```console
    dotnet new webapi DeviceMicroservice
    ```
    * create a .NET project for the Monitoring MicroService (inside the `ds-back-users` directory)
    ```console
    dotnet new webapi MonitoringMicroserviceNET
    ```
     * create a .NET project for the Monitoring MicroService (inside the `ds-back-users` directory)
    ```console
    dotnet new webapi ChatMicroservice
    ```
    * clone the repository in `your-folder`
    ```console 
    git clone https://gitlab.com/ds2023-ratoi-razvan/ds2023_30442_ratoi_razvan_assignment_1.git
    ```
* Replace the src folder in the Angular project with the one pulled from the repository 
* Copy and paste the `Dockerfile` from `front-end` into the parent directory of `src` in your Angular project
* Add to each of the .NET projects the corresponding directories
* Open a terminal in `your-folder`
* In each project directory run the command 
```console
docker build -t <name>
```
where name will be `front`, `usermicroservice` and `devicemicroservice`
* Run the command (you can forget the `--build` if no changes were done to the code):
```console
docker-compose up --build
```
* Access http://localhost in your browser and you will be shown the Login Page
* Log in using one of the following credentials:
    * Administrator:
        * username: `admin`
        * password: `admin`
    * Client:
        * username: `client`
        * password: `client`
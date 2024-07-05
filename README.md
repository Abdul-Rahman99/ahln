What is AHLN Box?
Anywhere, Anytime Delivery: Users need not remain tethered to their homes. Whether at work, on vacation, or simply on the move, they can receive packages securely and remotely via our innovative AHLN box solution.
Our vision is to create a comprehensive and efficient package delivery system that adapts to the demands of today’s dynamic market landscape thus redefining convenience and elevating the customer experience.
Technical stack for "AHLN Box"
Backend: NodeJS + ExpressJS + i18n.
Frontend: React Native + ReactJS + Redux Toolkit + React Navigation + MQTT + Serial Port API + React Native Notification + i18n.
Authentication: Bearer token.
Database: SQL + PostgreSQL + pg-migrate.
Versioning tool: Git + GitHub.
Web Server: NGINX + pm2.
Database Diagrams

You can find a complete ERD Diagram from this link.
General System Flow Explanation
A box arrives to our warehouse.
An operation member add this box to the system and activates it.
the related charts should be updated automatically like (stock chart).
if a customer asks to buy a new box, a sales member should create an account for him with role customer, only asks him for:
Email or mobile phone.
His name.
a user should receive an email or sms confirming his enrollment process has started and tells him to download the owner application to sets up his profile.
after successful registration, a welcome notification should be sent to him from the application.
after that user should be able to see his box in the top of app homepage, now he can create new shipment, add relative customer, transfer box ownership, update his account, control his box, track his shipments history, see his upcoming packages, receive notification when any action happens on the box.
for the administration dashboard, all board members can now take actions, view reports, mange the system each depending on his roles and permissions.
Sets up a new AHLN Box
When a box arrives to our warehouse, it will have a model code and serial number.
If the model exists in our database then you should start in adding the box.
If the model is not exists in our database then you first need to add this model, after that you can add the box.
After that if the box has a tablet then you should link this tablet to the box, so when the user activates the box the tablet gets the user_id from the box linked to it already.
Customers onboarding
There are two types of customers:
Customer: the user who buys the box.
Relative Customer: the son, wife or any relative to the main customer.
There are two possible scenarios of onboarding, either the customer comes to our store and the sales user creates onboard him on the system and link the box to him, or he orders Ahln box from online store so he will take care of his whole onboarding cycle, let's see both cycles:
If he buys AHLN Box from our store:
The sales person will add new user with only email/phone and name
After that the user choose his box, then the sales person will search for that box with it's serial number which is fixed on the box then he will update the box and the user_id in it's field in the box.
Then the user will receive a notification congrats him for buying AHLN Box, and tells him to download the owner app from the app store.
Then he will register a profile with same email/phone he gave to the sales person.
Finally he will be able to see his box from the control panel section in the app.
If he buys AHLN Box from online store:
When the user receives his box he will find the serial number on it.
After that he will download the owner app and start felling a register form.
then when he enters the app he will be able to set up his AHLN Box from the specified section in the control panel.
After finishing the setup for his box by entering the box serial number in the setup screen he will see his box in the homepage.
Authentication and Authorization Explained
For both mobile apps and admin dashboard, we will be using bearer tokens for auth. And also we have another layers of security either in front-end side, back-end side and finally on database level.
For handling permissions, roles we have implemented this common design:
  
this will give us the ability to give the users certain roles and give this roles certain permissions, and also we will have the ability to assign permissions directly to the user table.
The Authorize middle-ware: 
It firstly validates if the user has a valid bearer token.
after that it will check if he has permissions to access the requested API either directly or through an role 
if the request sent from client side is post it first will validates on the data submitted if it matches the required fields.
Operations Flow Explained
The operations manger and user role begins when new Box arrives to the warehouse, they will be responsible for inserting them to the system so the sales can take actions on them.
Also they play a vital role on replying to customers inquiries about the project or contacting them to offer buying the Box.
They should have access to box APIs according to user stories listed in the other section.
They also should have access to Shipping Companies APIs. 
Sales Flow Explained
The sales users will be the front store of AHLN they will be able to edit box table and users(only creation) table. They also need to have access to sales charts so they can track their sales.
Technicians Flow Explained 
The technicians will be the people responsible for support tickets so they need to have a complete access on it.
Admins Flow Explained
The admins will have access to view dashboards of the system like lists charts, and only access to create board members and delete any of them.
System Mangers Flow Explained
Only one or two persons at most can have this role which will have complete access to everything on admin dashboard.
Adding new Delivery Package Flow
After the user creates his account now he wants to add new delivery package. Either he knows the tracking number or he will send the OTP to delivery guy to use it to open the box.
When he creates the package he should select the delivery box if he got multiple boxes or it should be auto selected if he only got one box.
After selecting the box he must select which door should receive this package.
when the package status is updated to delivered he should get a push notification on his mobile informing him with that.  

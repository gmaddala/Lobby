Lobby
=====

LocalStorage keys


---Application Configuration---

"key" - 6 figured unique app key

"deptname" - string of department name

"appid" - int unique app key

"rsvp" - bool

"anon" - bool

"initialintakestatus" - int

"confirmation"

"welcome" - string welcome message

"questions" - array of questions in current form

"allquestions" - array of all forms

"hasreasons" - bool, if there is a response page to display

"enforcedeligibility" - bool

"appdescription" - string

"allowregistration" - bool, if front page shows button which allows registration

"eligibilitytype"

"locations"

"selLocationID"

"intakeID" - set to -1 on default, only set if we're submitting a corresponding post eval form


---Individual Student Info---

"uid"

"firstname"

"lastname"

"phone"

"email"

"cardswiped" - bool, if they used the cardreader (vs. typing in UID)

"postformidlist" - array of form IDs to show (if any) for post forms

"preformid" - int of pre form ID to show

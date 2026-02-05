### Company
+ id : int
+ company_name : string
+ admin_first_name : string
+ admin_last_name : string
+ email : string
+ email_verified : boolean
+ confirmation_code : string
+ password_hash : string
+ confirmation_password : -> front end only, not stored in db
+ location : string
+ website_url: string
+ logo: string
+ created_at : DateTime
+ updated_at : DateTime

### Company Profile
+ id : int
+ company_id :  relation(User(id))
+ profile_picture : img
+ company_name : string
+ location : string
+ links : object
+ opening: object

### Jobs -> owned by company
+ id : int
+ company_id : int
+ title: string
+ description: string
+ location : string
+ status: string -> 'open' | 'closed'
+ created_at : DateTime

### Challenge -> linked to job
+ id : int
+ job_id: relation(Job(id))
+ title: string
+ prompt: string
+ difficulty: string -> 'easy' | 'medium' | 'hard'
+ tags: strings[] -> for search and categorization
+ version: int default 1
+ created_at: date

### Student
+ id : int
+ first_name : string
+ last_name : string
+ login : string
+ email : string
+ email_verified : boolean
+ confirmation_code : string
+ password_hash : string
+ confirmation_password : -> front end only
+ campus : string
+ location : string
+ gender : string
+ created_at : DateTime
+ updated_at : DateTime
### Student Profile
+ id : int
+ student_id :  relation(Student(id))
+ profile_picture : img
+ first_name : string
+ last_name: string
+ email : string
+ location : string
+ gender : string
+ links : object
+ skills : object
+ completed_challenges : object

### Student Links
+ id : int
+ profile_id: relation(Profile(id))
+ portfolio
+ linkedin
+ github
+ coding_games
+ neetcode
+ leetcode
+ code_wars

### Submission -> linked to students
+ id : int
+ job_id: relation(job(id))
+ challenge_id: relation(challenge(id))
+ student_id: relation(student(id))
+ code: string -> link to repo
+ submitted_at: date -> default NOW()
+ status: string -> 'pending' | 'accepted' | 'rejected' -> default 'pending'
+ score: int -> for ranking

### Feedback
+ id : int
+ submission_id: relation(submission(id))
+ reviewer_id: relation(user(id))
+ comments: string
+ created_at: date

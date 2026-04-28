export type userTypeFrontend = {
id: string
name: string
username: string
email: string
//password: string
role: "user" | "admin"
completed_tasks: number
score: number
//restore_token: string
created_at: string
updated_at: string
}
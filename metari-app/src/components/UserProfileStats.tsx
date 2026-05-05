type userProfileStats = {
    completed_tasks: number,
    score: number
};

export default function UserProfileStats({completed_tasks, score} : userProfileStats) {
    return (
        <>
            <div className="userProfileStats">
                <div className="titolComponent  text-center my-2">Stats</div>
                <hr className="m-0" />

                <ul>
                    <li className="listEntry">
                        Tasques completades: {completed_tasks}
                    </li>
                    <li className="listEntry">
                        Puntuació: {score}
                    </li>
                </ul>
            </div>
        </>
    );
}
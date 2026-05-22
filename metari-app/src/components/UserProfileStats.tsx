type userProfileStats = {
    completed_tasks: number,
    score: number
};

export default function UserProfileStats({ completed_tasks, score }: userProfileStats) {
    return (
        <>
            <div className="metaList userProfileStats">
                <div className="titolComponent my-2 ms-3"><i className="bi bi-bar-chart-fill text-primary"></i>Estadístiques</div>
                {/* <hr className="m-0" /> */}
                <div className="inline">
                    <ul>
                        <li className="listEntry">
                            Tasques completades: {completed_tasks}
                        </li>
                        <li className="listEntry">
                            Puntuació: {score}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
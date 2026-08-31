
import './AboutView.scss'
const AboutViewPage = () => {

    return (
        <div className="about">
            <h1>About me</h1>
            <p>I have quite a lot of hobbies, though I’m not an expert at any of them. This blog is where I document all my interests and track my progress on each hobby as I go. No fancy mastery, just honest notes of exploration and small updates along the way.</p>
            <div className="flex justify-center">
                <img
                    src="/src/assets/imgs/happy.png"
                    className="d-block w-50"
                    alt="happy"
                />
            </div>
        </div>
    );

}

export default AboutViewPage;
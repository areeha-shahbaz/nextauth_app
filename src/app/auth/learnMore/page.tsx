'use client';
import {useRequireAuth} from "../../../authCondition";
 function LearnMorePage(){
    useRequireAuth();
    return(
       
        <div className="page-container">
            <main className="page-main">
                <div className="overlay">
                    <h2>Detail Information</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae dolore eaque quis praesentium, commodi nisi eius officiis accusamus corporis delectus ratione architecto culpa, eveniet iure quod nesciunt adipisci dignissimos id cupiditate ab! Eius vero ipsa iste. Illum ad laborum sint iusto, officiis expedita, soluta non ipsum deleniti laudantium, beatae amet commodi nisi eius officiis accusamus corporis delectus ratione architecto culpa, eveniet iure quod nesciunt adipisci dignissimos id cupiditate ab! Eius vero ipsa iste. Illum ad laborum sint iusto, officiis expedita, soluta non ipsum deleniti laudantium, beatae amet.</p>
                </div>
                </main>
        </div>
    )
}
export default LearnMorePage;
import MainNavbar from "../../components/main-navbar/MainNavbar"
import ReactGA4 from "react-ga4";

const TrackGoogleAnalyticsEvent = (
    category: any,
    action: any,
  ) => {
    console.log("GA event = ", "category :" , category, ":", "action :", action);
  
    ReactGA4.event({
      category: category,
      action: action,
    });
  };
  

const Analytics = () => {
    const tracking_id = `G-9Y5FPG5V00`; 
    ReactGA4.initialize(tracking_id);
    console.log("GA INITIALIZED");
 
  




  return (
    <>
    <MainNavbar/>
    <div>
        <h2>Analytics</h2>
            <h2>THE MAGIC TOOL</h2>
            <br />    <br />
            <h2>GUERRATOOL</h2>
            <br />    <br />
            <h2>GUERRADONE</h2>
    </div>

    </>
    
  )
}
export {Analytics, TrackGoogleAnalyticsEvent };  
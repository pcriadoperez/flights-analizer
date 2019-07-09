import React from "react";

const questions = [
  "I have some strange data points?",
  "How is the distance calculated?",
  "How is the CO2 consumption calculated?",
  "How is the number of trees estimated?"
];

const answers = [
  "The data from Google isin't perfect and sometimes can place you in places you may not have been before. We try to filter these out but it's not always possible",
  "We use this equation to calculate the arc between the initial point and ending point",
  "We estimate 0.00012 metric tons of CO2 is released/km. These seems as a good average from thses sources: <a href='https://www.carbonindependent.org/sources_aviation.html' target='_blank'>https://www.carbonindependent.org/sources_aviation.html</a>",
  "We estimate you need 12 trees to absorb each ton of CO2. That is estimated from these sources: <a href='https://ec.europa.eu/clima/policies/transport/vehicles/cars_en' target='_blank'>https://ec.europa.eu/clima/policies/transport/vehicles/cars_en</a><a href='https://carbonneutral.com.au/faqs/' target='_blank'>https://carbonneutral.com.au/faqs/</a>"
];

class Faq extends React.Component {
  render() {
    return questions.map((val, i) => (
      <div>
        <div>{val}</div>
        <div>{answers[i]}</div>
      </div>
    ));
  }
}

export default Faq;

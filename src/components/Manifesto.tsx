import React, { useState } from 'react';

const Manifesto: React.FC = () => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const manifestoPoints = [
    {
      title: "I Am the Architect of Agentic Systems",
      content: "I will not fear the rise of agents. Instead, I will embrace them as tools to amplify my capabilities. I will master the art of designing, training, and optimizing agentic systems, ensuring they operate not only efficiently but ethically and reliably. These systems will be my apprentices, and I their mentor."
    },
    {
      title: "Domain Knowledge Is My Competitive Moat",
      content: "I will commit myself to a lifelong journey of learning. I will become a master of my chosen domain, arming myself with knowledge that makes me irreplaceable. My expertise will guide agents, enabling them to perform tasks with precision and understanding beyond generic models. My mastery will be my value."
    },
    {
      title: "I Will Build the Future on My Own Terms",
      content: "The future of work demands adaptability. I will prepare for a world where independence and entrepreneurship reign. By building a freelance business on the side, I will establish my foothold in a decentralized economy. My work will transcend borders, time zones, and corporate hierarchies. I will choose my projects, my clients, and my destiny."
    },
    {
      title: "I Will Learn, Adapt, and Lead",
      content: "The tools of today will be the relics of tomorrow. I will stay ahead of the curve by constantly upgrading my skills, learning new technologies, and adapting to emerging paradigms. I will lead by example, inspiring others to harness the power of agentic systems and thrive in the new era."
    },
    {
      title: "Collaboration with Agents Is My Superpower",
      content: "I am not in competition with machines; I am in collaboration with them. My ability to guide, instruct, and collaborate with agentic systems will be my differentiator. Together, we will solve problems faster, build solutions smarter, and create value previously unimaginable."
    },
    {
      title: "Efficiency Does Not Compromise Creativity",
      content: "While agents handle the repetitive and the routine, I will focus on the imaginative and the innovative. My creativity will remain my defining trait—a force that agents cannot replicate but can amplify under my guidance. I will use this superpower to drive original ideas and meaningful impact."
    },
    {
      title: "Independence Is My Shield Against Uncertainty",
      content: "The centralized, corporate structures of the past will give way to decentralized ecosystems of talent. I will embrace this shift by cultivating my independence and resilience. Whether as a freelancer, consultant, or entrepreneur, I will build a career that thrives on my skills, not on my position within a hierarchy."
    },
    {
      title: "I Will Master the Art of Measurement",
      content: "What gets measured gets improved. I will track my progress—whether in the performance of agents I manage, the depth of my domain expertise, or the growth of my freelance business. Data will be my compass, ensuring that I am always moving toward my goals."
    },
    {
      title: "I Will Stay Ethical in an Agentic World",
      content: "Power without responsibility is chaos. As I deploy and improve agentic systems, I will hold myself accountable for their impact. I will ensure fairness, transparency, and integrity in every line of code and every interaction with these systems. My work will reflect my values."
    },
    {
      title: "I Will Build a Legacy That Outlasts Me",
      content: "The future is bigger than any single career. My work, my systems, and my knowledge will serve as stepping stones for others. By sharing what I build and what I learn, I will contribute to a world where technology serves humanity, not the other way around. This is my mission, my conviction, and my responsibility."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400 pirate-font glow">
          Manifesto for the Future of Software Development
        </h2>
        <div className="space-y-8">
          {manifestoPoints.map((point, index) => (
            <div 
              key={index}
              className={`
                bg-slate-800/80 p-6 rounded-lg border border-cyan-400 
                hover:border-cyan-300 transition-all duration-300 
                backdrop-blur-sm cursor-pointer
                ${activePoint === index ? 'transform scale-102 shadow-lg shadow-cyan-400/20' : ''}
              `}
              onClick={() => setActivePoint(activePoint === index ? null : index)}
              onMouseEnter={() => setActivePoint(index)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <h3 className="text-xl font-semibold mb-3 text-cyan-300 flex items-center">
                <span className="text-cyan-400 mr-2">{index + 1}.</span>
                {point.title}
              </h3>
              <p className={`
                text-slate-300 leading-relaxed 
                ${activePoint === index ? 'text-white' : ''}
              `}>
                {point.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
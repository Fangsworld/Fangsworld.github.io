import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={`hero-section ${styles.root}`} aria-labelledby="home-positioning">
      <div className="container">
        <div className={styles.content}>
          <h1 id="home-positioning" className="section-subtitle">跨学科的 AI 实践者</h1>
          <p>我关心 AI，也关心使用它的人。从认知科学理解思考，从内容与传播理解影响，从写作理解表达，从经济理解价值——这些视角共同构成我做 AI 产品的方式。</p>
          <ul className={styles.topics} aria-label="关注领域">
            {['认知科学', '内容与传播', '写作', '经济', '人工智能'].map(topic => <li key={topic}>{topic}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

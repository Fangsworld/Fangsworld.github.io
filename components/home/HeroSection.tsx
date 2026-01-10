export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">宇文平野</h1>
            <p className="hero-subtitle">思维与写作的探索者</p>
            <p className="hero-description">
              热爱思维与写作，分享关于阅读、写作、逻辑、言语的知识。
              在这个信息爆炸的时代，我专注于深度思考与有效表达，
              用文字构建思维的桥梁，用逻辑点亮智慧的火花。
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-avatar">
              <img src="/images/personal-photo.jpg" alt="宇文平野头像" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

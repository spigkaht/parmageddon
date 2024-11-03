class UserAgentLogger
  def initialize(app)
    @app = app
  end

  def call(env)
    user_agent = env['HTTP_USER_AGENT']
    Rails.logger.info "User-Agent: #{user_agent}"
    @app.call(env)
  end
end

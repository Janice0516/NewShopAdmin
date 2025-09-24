module.exports = {
  // 生成随机时间戳
  timestamp: function(context, events, done) {
    const now = new Date()
    // 生成过去1小时内的随机时间戳
    const randomTime = new Date(now.getTime() - Math.random() * 3600000)
    context.vars.timestamp = randomTime.toISOString()
    return done()
  },

  // 记录响应时间统计
  logResponse: function(requestParams, response, context, ee, next) {
    if (response.statusCode >= 400) {
      console.log(`错误响应: ${response.statusCode} - ${requestParams.url}`)
    }
    
    // 记录缓存命中情况
    if (response.statusCode === 304) {
      console.log(`缓存命中: ${requestParams.url}`)
    }
    
    return next()
  },

  // 设置自定义指标
  setCustomMetrics: function(context, events, done) {
    // 可以在这里添加自定义性能指标
    return done()
  }
}
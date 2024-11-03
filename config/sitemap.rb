require 'rubygems'
require 'sitemap_generator'

SitemapGenerator::Sitemap.default_host = "https://www.parmageddon.net"
SitemapGenerator::Sitemap.public_path = 'public/' # Ensures the sitemap is generated in the public directory
SitemapGenerator::Sitemap.sitemaps_path = ''

SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'daily', priority: 1.0
  add '/venues', :changefreq => 'weekly', priority: 0.8
end

require "rexml/document"

ROOT = File.expand_path("..", __dir__)
SITE_ROOT = File.join(ROOT, "_site")
SITEMAP_PATH = File.join(SITE_ROOT, "sitemap.xml")
EXPECTED_PREFIX = "https://ozirix-dev.github.io/Ravinto/"

abort "Missing built sitemap: #{SITEMAP_PATH} (run Jekyll build first)" unless File.file?(SITEMAP_PATH)

begin
  sitemap = REXML::Document.new(File.read(SITEMAP_PATH, encoding: "UTF-8"))
rescue REXML::ParseException => error
  abort "Invalid sitemap XML: #{error.message}"
end

urls = REXML::XPath.match(sitemap, "//*[local-name()='loc']").map(&:text)
abort "Sitemap contains no URLs" if urls.empty?
invalid = urls.reject { |url| url&.start_with?(EXPECTED_PREFIX) }
abort "Sitemap URLs outside #{EXPECTED_PREFIX}:\n#{invalid.join("\n")}" unless invalid.empty?

robots = File.read(File.join(SITE_ROOT, "robots.txt"), encoding: "UTF-8")
expected_sitemap = "Sitemap: #{EXPECTED_PREFIX}sitemap.xml"
abort "robots.txt must include `#{expected_sitemap}`" unless robots.lines.map(&:strip).include?(expected_sitemap)

puts "Validated #{urls.length} sitemap URLs and matching robots.txt reference."

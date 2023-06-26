import youtube_dl

def download_video(url):
    ydl_opts = {
        'no-cache-dir': True,
        'format': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# Example usage
video_url = "https://www.youtube.com/watch?v=CEpqWflUnMk"
download_video(video_url)

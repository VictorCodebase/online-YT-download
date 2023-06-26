import os
import sys
import shutil

from pytube import Playlist

class YTplaylist(Playlist):

    def __init__(self, playlist_url):
        
        self.root_dir = os.getcwd()
        try:
            self.url = playlist_url
            pl = Playlist(self.url)
            self.playlist_title = pl.title

        except Exception:
            print("")
            print("Something went wrong, check your internet connection")
            print("Also, make sure the link is for a playlist, and is valid!")
            print("")
            sys.exit(1)

        #Get video list
        stream_object = pl.videos
        self.video_objects = []
        
        for vobject in stream_object:
            self.video_objects.append(vobject)

        if self.video_objects: #confirm the playlist is not empty
            for video_object in self.video_objects:
                print(video_object.title)

        else :
            print("Looks like the playlist might be empty. Get it populated first.")
            sys.exit()

        #check for the music file else create one
        self.check_storage()






    def check_storage(self):
        current_directory = os.getcwd()
        dirlist = os.listdir(current_directory)

        if "Stream_download"  not in dirlist: #check for a receptacle file
            print("\nMissing stream receptacle folder")
            os.mkdir("Stream_download")

            if "Stream_download" in os.listdir(current_directory): #if receptacle absent create one
                print("Stream receptacle folder successfully created!")

            else: #confrm one was created
                print("Seems like a receptacle file cannot be created") 
                sys.exit(2)

        #check playlist individual folder 
        # playlist folder matches the playlist name
        streams_dir= current_directory+"/Stream_download"
        streams_list = os.listdir(streams_dir)

        if self.playlist_title not in streams_list:
            os.chdir(streams_dir)
            os.mkdir(self.playlist_title)    
            print("A new playlist has been established")

            
        if "New_Arrivals" not in os.listdir(streams_dir+f"/{self.playlist_title}"):
            #print(streams_list)
            os.chdir(streams_dir+"/"+self.playlist_title)
            os.mkdir("New_Arrivals")
            print("New_Arrivals folder created")
        


        

    def downloader(self):
        print("\n==========- OPERATING DOWNLOADER -==========")
        
        choices = ["Y","N"]

        while True:
            response = input(f"Commence download from {self.playlist_title}? Y/N \n >> ").upper()
            if response in choices :
                if response == "N":
                    print("---OPERATION CANCELED---")
                    sys.exit()

                else:
                    break


        #change into the specific playlist folder before download
        playlist_dir = self.root_dir+"/Stream_download/"+self.playlist_title

        new_arrivals_dir = self.root_dir+"/Stream_download/"+self.playlist_title+"/New_Arrivals"
        #os.chdir(new_arrivals_dir)

        offline_playlist = os.listdir(playlist_dir)
        offline_list = []

        for track in offline_playlist:
            track = track.replace(".mp4","")
            offline_list.append(track)

        #print(offline_playlist)

        new_arrivals = os.listdir(new_arrivals_dir)

        if new_arrivals :
            for track in new_arrivals:
                os.remove(new_arrivals_dir + "/" + track)


              
        #scan through all the video titles checking if they are on the system
        for track in self.video_objects:
            #print(track)

            title = track.title
            #clean the track titles of punctuation for offline list matching
            for punctuation in ["/",'"',"'",".",",",";",":"]:
                title = title.replace(punctuation, "")
            
            
            print(title)
            
            if title in offline_list:
                #if in the folder with songs then pass its iteration of the loop
                print(f"///////Match found! SKIPPING {title}//////////")
                print("")
                continue

            else:
                #if absent , attempt downloading the audio
                try:
                    piece = track.streams.filter(only_audio=True,file_extension="mp4")
                    print("///////////////DOWNLOADING///////////////")
                    print("")                


                    #download track to new arrivals!
                    piece[0].download(new_arrivals_dir)          
                                  
                   

                except  KeyboardInterrupt:
                    print("Keyboard Interrupt, cloning New Arrivals!")
                    new_arrivals = os.listdir(new_arrivals_dir)

                    for file in new_arrivals:
                        src = new_arrivals_dir + f"/{file}"
                        shutil.copy(src , playlist_dir)
                
                    sys.exit(2)


                except Exception:
                    print("Download failure")
                    new_arrivals = os.listdir(new_arrivals_dir)

                    for file in new_arrivals:
                        src = new_arrivals_dir + f"/{file}"
                        shutil.copy(src , playlist_dir)
                
                        sys.exit(2)


        #copy everything from new arrivals into playlist folder once the whole list is
        #downloaded

        new_arrivals = os.listdir(new_arrivals_dir)

        for file in new_arrivals:
            src = new_arrivals_dir + f"/{file}"
            shutil.copy(src , playlist_dir)
                



#TODO: Add functionality for multiple different types of downloads 
#TODO: To access these functionalities add a switch mechanism using a dictionary


#EVE
def intro():
    #Introduce the user to the program
    print(
        "HELLO WORLD!\n"+
        "As it stands this only downloads audio playlists from youtube to suit its original purpose\n"+
        "More functionality can be added by you or the author whenever\n"+
        "REMEMBER TO INSTALL THE PYTUBE module BEFORE RUNNING OR THE DOWNLOADER WILL CRASH!\n"+
        "===============- STANDARD VERSION -=================="        
    )
    

    choices = ["Y","N"]
       

    while True:
        
        response = input("DO you have PYTUBE installed? Y/N \n >> ").upper()

        if response in choices:
                
            if response == "N": #exit the program
                print("Run pip install Pygame on this folder. Thanks")
                sys.exit()


            else:
                break

        print("Y or N .... come on, it's simple.")       

    
    link = input("Paste your Youtube playlist link here! DO NOT ALTER THE LINK! \n>>")

    print("Please wait. Your playlist should be listed momentarily.\n")

    
    PlaylistIstance = YTplaylist(link)
    
    #print(PlaylistIstance.playlist_title)
    PlaylistIstance.downloader()

#RUN PROGRAM
intro()
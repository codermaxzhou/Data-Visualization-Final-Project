
setwd("/Users/shiwang/Workspace/573DataVis/final_project/DataVisFinal")  //set working directory
library(jsonlite)
json_file<- stream_in(file("yelp_business.json"))   //load json file
head(json_file,1)  //show the first line

json_file[10]<- list(NULL)   //eliminate columns, note that column start at index 1
//delete all the columns except business_id, categories, city, review_count, longitude, latitude, stars, name

unique(json_file$city)   //show unique cities
//select Montéal or Montreal, Montreal-Nord, Montreal-Ouest, Montreal-Est, Montréal-Ouest
data<- json_file[json_file$city=='Montréal',]   //select "Montréal", note the comma

//or
v<- c("Montréal", "Montréal-Ouest", "Montreal", "Montreal-Nord","Montreal-Ouest","Montreal-Est")
data<- json_file[json_file$city %in% v, ]    //4474 obs

data_1<- data[grepl("Restaurants",data$categories),]  //grep business categories contain "Restaurants" 2597 obs

x<- toJSON(data_1)
write(x, file="business_info.json")   //write out to a json file

data_2<- data_1[sample(nrow(data_1), 500), ]  //randomly pick 500 rows

data_2<- data_1[data_1$review_count>20, ]   //get restaurants that have more than 20 reviews
data_2<- data_1[data_1$review_count<100, ]   //get restaurants that have less than 100 reviews

ggplot(data_2, aes(x=review_count)) +
     geom_histogram(binwidth=.5, colour="black", fill="white")    //see its distribution histogram

data_1[1,2][[1]][1]  //access categories col list : "Cafes"
data_1["cat"]<-NA     // create a new col "cat"
for(i in 1:2597){data_1$cat[i]<-data_1[,2][[i]][1]}   //fill it with the first element on the categories list

ggplot(data_1, aes(stars, fill=cat)) + geom_bar()  //plot stacked bar

data_french<- data[grepl("French",data$categories),]    //collect french restaurants

data_4=rbind(data_french, data_italy, data_mexico,data_american,data_asia,data_india)
//add the tables together

function scrapeCommentsWithoutReplies() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = [];
  result.push(['Name', 'Comment', 'Time', 'Likes', 'Reply Count']);
  var vid = ss.getSheets()[0].getRange(1, 1).getValue();
  var nextPageToken = '';

  while (true) {
    try {
      var data = YouTube.CommentThreads.list('snippet', { videoId: vid, maxResults: 100, pageToken: nextPageToken });
      
      if (!data.items || data.items.length === 0) {
        break;
      }

      for (var i = 0; i < data.items.length; i++) {
        var comment = data.items[i].snippet.topLevelComment.snippet;
        result.push([
          comment.authorDisplayName,
          comment.textDisplay,
          comment.publishedAt,
          comment.likeCount,
          data.items[i].snippet.totalReplyCount
        ]);
      }

      nextPageToken = data.nextPageToken;
      if (!nextPageToken) {
        break;
      }
    } catch (e) {
      Logger.log('Error fetching comments: ' + e);
      break;
    }
  }

  var newSheet = ss.insertSheet(ss.getNumSheets());
  newSheet.getRange(1, 1, result.length, 5).setValues(result);
}

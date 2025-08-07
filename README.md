# MoviesDatabase API Project

## API Overview

The MoviesDatabase API provides comprehensive and up-to-date information for over 9 million titles (movies, TV series, and episodes) and 11 million actors, crew, and cast members. This powerful API offers complete movie and television data including YouTube trailer URLs, awards information, full biographies, ratings, box office data, and many other useful details.

Key features of the MoviesDatabase API include:
- Extensive database with 9+ million titles and 11+ million cast/crew members
- Regular updates: recent titles updated weekly, ratings and episodes updated daily
- Rich metadata including plots, cast, crew, ratings, awards, and technical specifications
- Flexible search capabilities by title, keyword, and alternative titles (AKAs)
- Support for filtering and sorting results
- Comprehensive information about actors and their filmographies
- Box office and budget information
- Episode and season data for TV series

## Version

API Version: Current (actively maintained with weekly and daily updates)

## Available Endpoints

### Titles

- **GET /titles** - Returns multiple titles with filtering and sorting options
- **GET /x/titles-by-ids** - Returns titles by a list of IMDb IDs
- **GET /titles/{id}** - Returns detailed information for a specific title
- **GET /titles/{id}/ratings** - Returns rating and vote count for a specific title
- **GET /titles/x/upcoming** - Returns upcoming titles

### Series and Episodes

- **GET /titles/series/{id}** - Returns all episodes for a series
- **GET /titles/seasons/{id}** - Returns the number of seasons for a series
- **GET /titles/series/{id}/{season}** - Returns episodes for a specific season
- **GET /titles/episode/{id}** - Returns detailed episode information

### Search

- **GET /titles/search/keyword/{keyword}** - Search titles by keyword
- **GET /titles/search/title/{title}** - Search titles by title name
- **GET /titles/search/akas/{aka}** - Search titles by alternative titles (exact match)

### Actors

- **GET /actors** - Returns multiple actors with pagination
- **GET /actors/{id}** - Returns detailed information for a specific actor

### Utilities

- **GET /title/utils/titleType** - Returns available title types
- **GET /title/utils/genres** - Returns available genres
- **GET /title/utils/lists** - Returns available predefined lists

## Request and Response Format

### Request Structure

All endpoints accept optional query parameters. Here's an example request:

```
GET /titles?info=base_info&limit=20&page=1&genre=Action&year=2023&sort=year.desc
```

### Common Query Parameters

- `info`: Specifies information level (mini_info, base_info, image, etc.)
- `limit`: Number of results per page (default: 10, max: 50)
- `page`: Page number (default: 1)
- `titleType`: Filter by title type
- `genre`: Filter by genre (case-sensitive, capitalized)
- `year`: Filter by specific release year
- `startYear`/`endYear`: Filter by year range
- `sort`: Sort results (year.incr, year.decr)
- `list`: Use predefined lists (most_pop_movies, top_rated_250, etc.)

### Response Structure

All endpoints return an object with a `results` key. Paginated endpoints include additional keys:

```json
{
  "results": [
    {
      "id": "tt0111161",
      "titleText": {
        "text": "The Shawshank Redemption"
      },
      "primaryImage": {
        "url": "https://example.com/image.jpg"
      },
      "titleType": {
        "text": "Movie"
      },
      "releaseDate": {
        "year": 1994
      }
    }
  ],
  "page": 1,
  "next": "next_page_url",
  "entries": 250
}
```

### Information Levels

- `mini_info`: Basic title information (titleText, id, primaryImage, titleType, releaseDate)
- `base_info`: Extended information including genres, runtime, plot, ratings
- `image`: ID and primary image only
- `creators_directors_writers`: ID with creators, directors, and writers
- `revenue_budget`: ID with financial information
- `extendedCast`: ID with full cast information
- `rating`: ID with ratings summary
- `awards`: ID with wins, nominations, and awards

## Authentication

The MoviesDatabase API requires authentication through API headers. You'll need to:

1. Obtain an API key from the MoviesDatabase service
2. Include the API key in your request headers:

```
X-RapidAPI-Key: YOUR_API_KEY
X-RapidAPI-Host: moviesdatabase.p.rapidapi.com
```

**Security Best Practice**: Never hardcode API keys in your source code. Use environment variables or configuration files that are excluded from version control.

```bash
# Environment variable example
export MOVIES_API_KEY="your_api_key_here"
```

## Error Handling

The API returns standard HTTP status codes and error responses:

### Common HTTP Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters or malformed request
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Resource not found (invalid ID)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The specified genre is not valid",
    "details": "Available genres can be retrieved from /title/utils/genres"
  }
}
```

### Error Handling Best Practices

1. Always check the HTTP status code before processing the response
2. Implement retry logic for temporary failures (5xx errors)
3. Handle rate limiting by implementing exponential backoff
4. Validate input parameters before making API calls
5. Log errors for debugging and monitoring

## Usage Limits and Best Practices

### Rate Limits

- Standard rate limiting applies (specific limits depend on your subscription plan)
- Implement exponential backoff when rate limits are exceeded
- Monitor your usage through API response headers

### Best Practices

#### Efficient Data Retrieval

1. **Use appropriate info levels**: Request only the data you need
   - Use `mini_info` for basic listings
   - Use specific info parameters like `rating` or `image` for targeted data

2. **Implement pagination**: Use `limit` and `page` parameters for large datasets
   ```
   GET /titles?limit=50&page=1
   ```

3. **Cache responses**: Store frequently accessed data to reduce API calls
   - Cache popular movie data, genre lists, and title types
   - Implement appropriate cache expiration based on data freshness needs

#### Search Optimization

1. **Use specific endpoints**: Choose the most appropriate search endpoint
   - Use `/titles/search/title/` for title-based searches
   - Use `/titles/search/keyword/` for broader content searches

2. **Filter effectively**: Combine multiple query parameters to narrow results
   ```
   GET /titles?genre=Action&year=2023&sort=year.desc&limit=20
   ```

3. **Leverage predefined lists**: Use curated lists for common use cases
   - `most_pop_movies` for trending content
   - `top_rated_250` for highly-rated films
   - `top_boxoffice_200` for commercial successes

#### Performance Recommendations

1. **Batch requests**: Use `/x/titles-by-ids` for multiple specific titles
2. **Monitor response times**: Track API performance and adjust request patterns
3. **Handle timeouts gracefully**: Implement proper timeout handling and retries
4. **Use compression**: Enable gzip compression for faster data transfer

#### Data Management

1. **Validate IDs**: Ensure IMDb IDs are properly formatted (e.g., "tt0111161")
2. **Handle missing data**: Not all titles have complete information
3. **Respect data freshness**: Recent titles are updated weekly, ratings daily
4. **Support internationalization**: Use AKAs endpoint for alternative titles

### Example Implementation Pattern

```javascript
// Example with error handling and rate limiting
async function fetchMovieData(movieId, retryCount = 0) {
  try {
    const response = await fetch(`/titles/${movieId}?info=base_info`, {
      headers: {
        'X-RapidAPI-Key': process.env.MOVIES_API_KEY,
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
      }
    });

    if (response.status === 429 && retryCount < 3) {
      // Exponential backoff for rate limiting
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return fetchMovieData(movieId, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Support

For additional support and to help maintain this free API service, consider supporting the developers at: https://www.buymeacoffee.com/SAdrian13

---

*This README was created for ALX Project 0x14 as part of learning API documentation and integration.*
